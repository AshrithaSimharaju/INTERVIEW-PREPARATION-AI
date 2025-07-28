require("dotenv").config();
const fetch = require("node-fetch");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

// Get keys from .env
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;

if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) {
  console.error("❌ Missing OpenRouter API key or model in environment variables!");
}

function tryParseJsonOutput(rawText) {
  try {
    let cleaned = rawText.trim();

    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    }

    // Replace inline backtick literals with proper strings
    cleaned = cleaned.replace(/`([^`]*)`/g, (_, code) => JSON.stringify(code));

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse AI output as JSON:", err.message);
    console.error("Raw output was:", rawText);
    return null;
  }
}

async function generateInterviewQuestions(req, res) {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

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
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    // Attempt to parse the JSON response
    const parsed = tryParseJsonOutput(rawText);

    if (!parsed || !Array.isArray(parsed)) {
      return res.status(200).json({
        message: "AI response could not be parsed as JSON. Returning raw text.",
        raw: rawText
      });
    }

    res.status(200).json({
      title: "Generated Interview Questions",
      questions: parsed
    });

  } catch (err) {
    console.error("❌ Error generating interview questions:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

async function generateConceptExplanation(req, res) {
  const { concept, question } = req.body;
  const input = concept || question;

  if (!input) return res.status(400).json({ message: "Concept or question is required" });

  const prompt = conceptExplainPrompt(input);

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
        messages: [{ role: "user", content: prompt }]
      }),
    });

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    const parsed = tryParseJsonOutput(rawText);

    if (parsed) {
      return res.status(200).json({
        title: parsed.title || "Concept Explanation",
        explanation: parsed.explanation || parsed.answer || parsed,
      });
    } else {
      return res.status(200).json({
        title: "Concept Explanation",
        explanation: rawText,
      });
    }

  } catch (err) {
    console.error("Concept Explanation API Error:", err);
    return res.status(500).json({ error: "Failed to generate concept explanation" });
  }
}

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
