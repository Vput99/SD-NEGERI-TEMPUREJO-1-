
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_CONTEXT } from "../constants";

// Helper untuk membaca Env Variable dengan aman di berbagai environment (Vite/Next/CRA)
const getApiKey = () => {
  try {
    // Cek Vite Environment (biasanya dipakai Vercel untuk React)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}

  try {
    // Cek Standard Process Env (Node.js / Webpack)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {}
  
  return "";
};

const apiKey = getApiKey();
// Inisialisasi hanya jika API Key ada untuk mencegah crash
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (message: string, history: string[]) => {
  if (!ai) {
    console.warn("API Key Gemini tidak ditemukan. Pastikan Environment Variable VITE_API_KEY atau API_KEY sudah diset di Vercel.");
    return "Maaf, fitur asisten Bu Guru sedang dalam perbaikan (Kunci API belum dipasang). Silakan hubungi admin sekolah.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_CONTEXT,
      },
    });
    
    const result = await chat.sendMessage({
      message: message
    });

    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, saat ini Bu Guru sedang sibuk. Silakan coba lagi nanti ya, Nak.";
  }
};
