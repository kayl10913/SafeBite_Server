// Gemini API Configuration
// Uses environment variable for security

const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY, // Load from environment variable
    model: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
};

module.exports = geminiConfig;
