# Shopify AI TTS Server (Vercel)

This server hosts a real-time Text-To-Speech API using OpenAI.
Deploy to Vercel → Use API in Shopify.

POST /api/tts
Body:
{
  "text": "Hello world",
  "voice": "alloy"
}

Returns MP3 audio stream.
