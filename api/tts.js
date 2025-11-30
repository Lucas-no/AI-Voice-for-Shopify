import OpenAI from "openai";

export default async function handler(req, res) {
  // --- FIX CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // -----------------

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const mp3 = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice || "alloy",
      input: text
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache");

    return res.status(200).send(audioBuffer);

  } catch (err) {
    console.error("TTS Error:", err);
    return res.status(500).json({ error: "TTS Generation Failed", detail: err.message });
  }
}
