import OpenAI from "openai";

export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const chosenVoice = voice || "alloy";

    // Gọi OpenAI TTS realtime
    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: chosenVoice,
      input: text,
      format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);

  } catch (err) {
    console.error("TTS Error:", err);
    res.status(500).json({ error: "TTS Generation Failed" });
  }
}
