const fetch = global.fetch || require('node-fetch');
const geminiConfig = require('../config/gemini');

const DEFAULT_TIMEOUT_MS = 15000; // 15s
const DEFAULT_RETRIES = 4;
const BASE_DELAY_MS = 500; // initial backoff

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs) {
    if (!timeoutMs) return promise;
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini request timed out')), timeoutMs))
    ]);
}

function isRetryableStatus(status, errorDetails) {
    if (!status) return true; // network errors
    if (status >= 500) return true; // 5xx
    if (status === 429) return true; // rate limited
    // Some providers use 400 with overloaded message; be cautious
    const msg = (errorDetails && (errorDetails.message || errorDetails.error?.message || '')) + '';
    if (status === 503) return true;
    if (/overload|overloaded|unavailable|rate|quota/i.test(msg)) return true;
    return false;
}

async function callGemini(pathSuffix, payload, options = {}) {
    if (!geminiConfig || !geminiConfig.apiKey) {
        throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY.');
    }

    if (geminiConfig.enableAI === false) {
        const e = new Error('Gemini disabled by config');
        e.disabled = true;
        throw e;
    }

    const {
        retries = DEFAULT_RETRIES,
        timeoutMs = DEFAULT_TIMEOUT_MS,
        baseDelayMs = BASE_DELAY_MS,
        maxDelayMs = 8000,
        signal
    } = options;

    const url = `${geminiConfig.baseUrl}/${geminiConfig.model}${pathSuffix}?key=${encodeURIComponent(geminiConfig.apiKey)}`;

    let attempt = 0;
    let lastError;
    while (attempt <= retries) {
        try {
            const res = await withTimeout(fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal
            }), timeoutMs);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                if (isRetryableStatus(res.status, errorData) && attempt < retries) {
                    const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt)) + Math.floor(Math.random() * 200);
                    await sleep(delay);
                    attempt++;
                    continue;
                }
                const e = new Error(`Gemini API error (${res.status})`);
                e.status = res.status;
                e.details = errorData;
                throw e;
            }

            return await res.json();
        } catch (err) {
            lastError = err;
            const status = err.status || 0;
            const details = err.details;
            if (isRetryableStatus(status, details) && attempt < retries) {
                const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt)) + Math.floor(Math.random() * 200);
                await sleep(delay);
                attempt++;
                continue;
            }
            break;
        }
    }

    throw lastError || new Error('Unknown Gemini error');
}

// Simple in-process LRU cache for identical payloads
const cache = new Map(); // key -> { json, expiresAt }
let callCountToday = 0;
let dayKey = new Date().toDateString();

function getCacheKey(parts, generationConfig) {
    return JSON.stringify({ parts, generationConfig });
}

function maintainCache() {
    // Reset daily counter
    const today = new Date().toDateString();
    if (today !== dayKey) {
        dayKey = today;
        callCountToday = 0;
    }
    // Trim cache if too large
    while (cache.size > (geminiConfig.cacheSize || 200)) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
}

async function generateContent(parts, generationConfig, options = {}) {
    maintainCache();

    const ttl = geminiConfig.cacheTtlMs || 0;
    const key = ttl ? getCacheKey(parts, generationConfig) : null;
    if (ttl && key && cache.has(key)) {
        const entry = cache.get(key);
        if (entry.expiresAt > Date.now()) {
            return entry.json;
        } else {
            cache.delete(key);
        }
    }

    // Soft daily cap
    if (geminiConfig.maxDailyCalls && callCountToday >= geminiConfig.maxDailyCalls) {
        const e = new Error('Gemini soft daily cap reached');
        e.rateLimited = true;
        throw e;
    }

    // Reduce cost in lowCostMode
    const finalGenCfg = { ...generationConfig };
    if (geminiConfig.lowCostMode) {
        if (typeof finalGenCfg.maxOutputTokens === 'number') {
            finalGenCfg.maxOutputTokens = Math.min(finalGenCfg.maxOutputTokens, 256);
        } else {
            finalGenCfg.maxOutputTokens = 256;
        }
        if (typeof finalGenCfg.topK === 'number') {
            finalGenCfg.topK = Math.min(finalGenCfg.topK, 32);
        }
        if (typeof finalGenCfg.temperature === 'number') {
            finalGenCfg.temperature = Math.min(finalGenCfg.temperature, 0.4);
        }
    }

    const payload = {
        contents: [{ parts }],
        generationConfig: finalGenCfg
    };

    const json = await callGemini(':generateContent', payload, options);
    callCountToday++;

    if (ttl && key) {
        cache.set(key, { json, expiresAt: Date.now() + ttl });
        maintainCache();
    }
    return json;
}

module.exports = {
    callGemini,
    generateContent
};


