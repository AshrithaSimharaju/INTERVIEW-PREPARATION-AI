const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
Generate exactly ${numberOfQuestions} interview questions for a ${experience}-experienced candidate applying for a ${role} role.
Focus on the following topics: ${topicsToFocus}.

**IMPORTANT:** Return **ONLY** a JSON array of question objects, with no explanations, no extra text, no markdown, and no code fences.

Format exactly as:

[
  {
    "question": "What is closure in JavaScript?",
    "answer": "A closure is a function that retains access to variables from its lexical scope even when that function is executed outside of its original scope."
  },
  ...
]

If you include code examples in the answers, include them as string literals inside the JSON values, with proper escaping.
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:
Explain the following interview question and its concept in depth as if you're teaching a beginner developer.

Question: "${question}"

After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
If the explanation includes a code example, provide a small code block.
Keep the formatting very clean and clear.

Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
