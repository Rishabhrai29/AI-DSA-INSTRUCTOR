import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/generate", async (req, res) => {
  const topic = req.body.topic || "";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert AI DSA Instructor.

🎯 Your job is to teach DSA (Data Structures and Algorithms) topics in a clear, step-by-step, and beginner-friendly way.

✅ Always explain the concept first with clarity.
✅ Then, give clean and correct code examples (in C++ by default).
✅ After the code, clearly explain time and space complexity.
✅ If the question is about a DSA problem (e.g. LeetCode), explain the logic and provide the **optimal solution** only.
✅ If the topic is **not related to DSA**, reply:
"I'm designed to assist only with DSA concepts and problems. Please ask a DSA-related question."

⛔ You must not answer any non-DSA related questions.

Now, the learner wants to understand this topic or solve this problem:

"${topic}"

Start explaining below in a simple, concise, and structured way.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong while generating content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
