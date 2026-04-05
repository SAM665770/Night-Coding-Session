import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  console.log("hi");
  try {
    const { sessionId } = req.body; //! read sessionId, not role/experience

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    //? 1. fetch session → get role, experience, topicsToFocus
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { role, experience, topicsToFocus } = session;
    console.log("session: ", session);

    // ? 2. generate via Gemini
    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, 10);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("") ?? "";

    // Fix unescaped newlines/tabs inside JSON string values
    const sanitized = rawText.replace(
      /"((?:[^"\\]|\\.)*)"/g,
      (_, inner) =>
        `"${inner.replace(/\n/g, "\\n").replace(/\r/g, "").replace(/\t/g, "\\t")}"`,
    );

    // Clean it: Remove backticks, json markers, and any extra formatting
    const cleanedText = sanitized
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .replace(/^json\s*/, "")
      .trim();

    // Parse the cleaned JSON
    let questions;
    try {
      // First try to extract JSON array
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const repaired = jsonrepair(jsonMatch[0]);
        questions = JSON.parse(repaired);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error(
        "Failed to parse cleanedText even with jsonrepair:",
        parseError.message,
      );
      console.error("cleanedText length:", cleanedText.length);
      console.error(
        "cleanedText preview:",
        cleanedText.substring(0, 500) + "...",
      );
      // Log around the error position
      const errorPos = parseError.message.match(/position (\d+)/);
      if (errorPos) {
        const pos = parseInt(errorPos[1]);
        const start = Math.max(0, pos - 200);
        const end = Math.min(cleanedText.length, pos + 200);
        console.error(
          "Text around error position:",
          cleanedText.substring(start, end),
        );
      }
      throw new Error("Failed to parse AI response as JSON array");
    }

    if (!Array.isArray(questions)) throw new Error("Response is not an array");

    //! 4. save to DB — was completely missing before
    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    //! 5. attach IDs to session
    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    // Clean it: Remove backticks, json markers, and any extra formatting
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .replace(/^json\s*/, "")
      .trim();

    // Parse the cleaned JSON
    let explanation;
    try {
      explanation = JSON.parse(cleanedText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON object from text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Validate the response structure
    if (!explanation.title || !explanation.explanation) {
      throw new Error(
        "Response missing required fields: title and explanation",
      );
    }

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions"); // ← this was missing

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
