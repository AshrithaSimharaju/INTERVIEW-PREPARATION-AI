const fetch = require('node-fetch');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;

exports.getAIResponse = async (prompt) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "InterviewPrepBot"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
  } catch (err) {
    console.error("AI generation failed:", err.message);
    return null;
  }
};
