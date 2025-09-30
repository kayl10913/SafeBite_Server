// Gemini API Configuration
// Uses environment variable for security

const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY, // Load from environment variable
    model: 'gemini-2.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1/models'
};

module.exports = geminiConfig;
