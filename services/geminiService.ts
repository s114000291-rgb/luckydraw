
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateTeamIdentities(count: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} creative, professional, and fun team names for a corporate event. Also provide a unique icebreaker question for each team.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              icebreaker: { type: Type.STRING }
            },
            required: ["name", "icebreaker"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating team identities:", error);
    // Fallback names if AI fails
    return Array.from({ length: count }, (_, i) => ({
      name: `Team ${i + 1}`,
      icebreaker: "What's your favorite hobby?"
    }));
  }
}
