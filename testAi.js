const OpenAI = require('openai');
require('dotenv').config();

(async () => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello world!" }],
    });
    console.log("✅ AI Working:", res.choices[0].message.content);
  } catch (err) {
    console.error("❌ AI Error:", err.message);
  }
})();
