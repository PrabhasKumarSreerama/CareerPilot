import { GoogleGenAI } from "@google/genai";

const aiIntraction = async () => {
  const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY
  });
  const interaction = await ai.interactions.create({
    model: "gemini-2.5-flash",
    input: "how does interview work?",
  });
  console.log(interaction.output_text);
}

export default aiIntraction;