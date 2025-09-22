# Gemini AI API Setup Guide

## Overview
The SafeBite AI analysis system uses Google's Gemini AI model to analyze food spoilage risk based on sensor data.

## Setup Steps

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variable
Create a `.env` file in the backend root directory (`safebitRestAPI/backend/`) with:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Alternative Configuration
If you prefer not to use environment variables, you can modify `config/gemini.js`:

```javascript
const geminiConfig = {
    apiKey: 'your_actual_api_key_here', // Direct key instead of process.env.GEMINI_API_KEY
    model: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
};
```

## API Usage

### Endpoint
`POST /api/ai/ai-analyze`

### Authentication
Requires valid JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Request Body
```json
{
    "foodType": "Yogurt",
    "temp": 25.5,
    "humidity": 70.2,
    "gas": 150.8
}
```

### Response
```json
{
    "analysis": {
        "riskLevel": "Medium",
        "riskScore": 65,
        "summary": "Elevated temperature and humidity increase spoilage risk",
        "keyFactors": ["High temperature", "Elevated humidity"],
        "recommendations": ["Move to cooler storage", "Check expiration date"],
        "estimatedShelfLifeHours": 12,
        "notes": "Based on typical dairy spoilage patterns"
    }
}
```

## Security Notes
- Never commit your API key to version control
- Use environment variables in production
- The API key is validated on each request
- All requests are logged for activity tracking

## Troubleshooting
- **"Gemini API key is not configured"**: Check your `.env` file or `gemini.js` config
- **"Gemini API error"**: Verify your API key is valid and has sufficient quota
- **"Model did not return valid JSON"**: The AI response couldn't be parsed - check the raw response in logs
