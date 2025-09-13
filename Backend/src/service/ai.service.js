const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generic Gemini helper with optional JSON schema
async function askGemini(prompt, schema = null) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: schema
      ? {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      : {},
  });

  return result.response.text(); 
}

module.exports = { askGemini };
