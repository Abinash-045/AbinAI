# AbinAI - Voice-Enabled AI Assistant

A full-stack web application featuring a voice-enabled AI assistant powered by Google's Gemini API. Users can interact with their personalized AI assistant through voice commands, customize their assistant's appearance and name, and perform various actions like web searches, opening websites, and getting information.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)

## Features

- **Voice Recognition**: Real-time speech-to-text using Web Speech API
- **AI-Powered Responses**: Integration with Google Gemini API for intelligent responses
- **Customizable Assistant**: Personalize your assistant's name and avatar image
- **Multiple Actions**: Support for web searches, social media access, video platforms, shopping sites, maps, weather, and more
- **User Authentication**: Secure signup/login with JWT tokens
- **Command History**: Track all interactions with the assistant
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

### Frontend
- React 19.1.0
- React Router DOM
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js & Express
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image Storage)
- Google Gemini API

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API Key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Setup

```bash
cd frontend
npm install
```

Update the server URL in `frontend/src/context/UserContext.jsx` if needed.

## Running the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Usage

1. Sign Up/Login with your credentials
2. Customize your assistant's name and avatar
3. Start speaking - the assistant listens for voice commands
4. Say your assistant's name followed by your command

**Example Commands:**
- "Jarvis, search for React tutorials"
- "Jarvis, open YouTube"
- "Jarvis, what's the weather today?"

## Author

**Abinash Behera**

---

⭐ If you like this project, please give it a star!
