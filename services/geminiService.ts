import { GoogleGenAI } from "@google/genai";
import { SYSTEM_CONTEXT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (message: string, history: string[]) => {
  try {
    // Construct a simple conversation turn for the AI context if needed, 
    // but here we primarily use the system instruction + current message for simplicity in this stateless example
    // or we can use the chat API properly. Let's use chat.
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_CONTEXT,
      },
    });

    // In a real app, we would replay the history. 
    // For this demo, we'll just send the latest message with the system instruction active.
    // If you want full history, you'd loop through history and add them to the chat history before sending.
    
    const result = await chat.sendMessage({
      message: message
    });

    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, saat ini Bu Guru sedang sibuk. Silakan coba lagi nanti ya, Nak.";
  }
};