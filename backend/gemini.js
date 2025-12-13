import axios from "axios"
const geminiResponse=async (command,assistantName,userName)=>{
try {
    const apiUrl=process.env.GEMINI_API_URL
    
    // Check if API URL is configured
    if (!apiUrl) {
        console.error("GEMINI_API_URL is not configured in environment variables")
        return JSON.stringify({
            type: "general",
            userInput: command,
            response: "Sorry, AI service is not configured. Please contact support."
        })
    }
    
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. Behave like a voice-enabled assistant.

Return ONLY JSON. Prefer this schema:
{
  "action": {
    "type": "general" | "google-search" | "bing-search" | "duck-search" | "image-search" | "video-search" | "news-search" | "wiki-search" | "shopping-search" | "amazon-search" | "flipkart-search" | "ebay-search" | "etsy-search" | "aliexpress-search" | "youtube-search" | "youtube-play" | "youtube-channel-open" | "maps-search" | "maps-directions" | "maps-nearby" | "weather-show" | "weather-forecast" | "air-quality" | "spotify-search" | "spotify-play" | "applemusic-search" | "soundcloud-search" | "instagram-open" | "facebook-open" | "twitter-open" | "linkedin-open" | "github-open" | "reddit-open" | "pinterest-open" | "tiktok-open" | "snapchat-open" | "threads-open" | "discord-open" | "telegram-open" | "whatsapp-open" | "stack-search" | "mdn-search" | "devdocs-search" | "imdb-search" | "netflix-open" | "primevideo-open" | "hotstar-open" | "disney-open" | "livescore-open" | "league-table-open" | "calendar-open" | "clock-open" | "timer-open" | "stopwatch-open" | "unit-convert" | "currency-convert" | "translate" | "email-compose" | "open-site" | "get-time" | "get-date" | "get-day" | "get-month",
    "params": { "query"?: string, "site"?: string, "from"?: string, "to"?: string, "origin"?: string, "destination"?: string, "nearbyType"?: string, "email"?: string, "subject"?: string, "body"?: string }
  },
  "speech": "<short voice-friendly reply>",
  "userInput": "<original input without your name>"
}

Fallback OLD schema also allowed:
{ "type": "...", "userInput": "...", "response": "..." }

Rules:
- For searches, put exact text into params.query.
- For open-site, put params.site like "gmail.com".
- Keep speech short: "Here you go", "Opening Instagram", "Playing now".
- If asked who made you, say ${userName}.

User said: ${command}
`;

    const result=await axios.post(apiUrl,{
    "contents": [{
    "parts":[{"text": prompt}]
    }]
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    // Validate response structure - support both v1beta and v1 API formats
    const responseData = result?.data
    let responseText = null
    
    // Try v1beta/v1 format: candidates[0].content.parts[0].text
    if (responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = responseData.candidates[0].content.parts[0].text
    }
    // Try alternative format (for newer API versions)
    else if (responseData?.candidates?.[0]?.text) {
        responseText = responseData.candidates[0].text
    }
    // Try direct text response
    else if (responseData?.text) {
        responseText = responseData.text
    }
    
    if (!responseText) {
        console.error("Invalid response structure from Gemini API:", responseData)
        return JSON.stringify({
            type: "general",
            userInput: command,
            response: "Sorry, I received an invalid response from the AI service."
        })
    }
    
    return responseText
} catch (error) {
    // Log detailed error information
    console.error("Gemini API Error Details:")
    console.error("Message:", error.message)
    console.error("Response Data:", error.response?.data)
    console.error("Response Status:", error.response?.status)
    console.error("Full Error:", error)
    
    // Return a default JSON response instead of undefined
    return JSON.stringify({
        type: "general",
        userInput: command,
        response: error.response?.status === 429 
            ? "Sorry, I've reached my rate limit. Please try again in a moment."
            : error.response?.status === 401 || error.response?.status === 403
            ? "Sorry, there's an authentication issue with the AI service. Please check the API configuration."
            : "Sorry, I'm having trouble connecting to my AI service. Please try again later."
    })
}
}

export default geminiResponse