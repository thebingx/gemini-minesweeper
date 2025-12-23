
import { GoogleGenAI } from "@google/genai";

// Initialize with the API key obtained exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVictoryMessage = async (playerName: string, time: number, size: string, difficulty: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Player ${playerName} just won a Minesweeper game on ${size} board with ${difficulty} difficulty in ${time} seconds. Write a short, encouraging, and witty 1-sentence victory message in the style of a witty game commentator.`,
    });
    // Use the .text property to extract the generated text.
    return response.text?.trim() || "You're a minesweeping legend!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Outstanding performance! You've cleared the field.";
  }
};

export const generateLossMessage = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "A player just hit a mine in Minesweeper and lost. Write a short, funny, 1-sentence supportive message encouraging them to try again.",
    });
    // Use the .text property to extract the generated text.
    return response.text?.trim() || "Boom! That was unexpected. Give it another shot!";
  } catch (error) {
    return "Watch your step next time! The mines are tricky.";
  }
};
