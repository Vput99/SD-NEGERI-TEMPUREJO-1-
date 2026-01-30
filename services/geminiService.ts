
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

export const generateNewsContent = async (title: string, imageBase64: string) => {
  if (!ai) {
    throw new Error("API Key tidak ditemukan.");
  }

  try {
    // Bersihkan header base64 jika ada (data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Asumsi kompresi di frontend menghasilkan jpeg
              data: cleanBase64
            }
          },
          {
            text: `Sebagai Humas SD Negeri Tempurejo 1, buatlah naskah berita website sekolah berdasarkan:
            1. Judul: "${title}"
            2. Analisis Gambar yang saya lampirkan.
            
            Gaya bahasa: Formal, positif, mendidik, dan jurnalistik khas sekolah.
            Gunakan Bahasa Indonesia yang baik dan benar (PUEBI).
            
            Output harus JSON dengan format:
            {
              "summary": "Ringkasan pendek 1-2 kalimat menarik untuk preview (maks 150 karakter).",
              "content": "Isi berita lengkap minimal 3 paragraf. Paragraf pertama 5W+1H, paragraf kedua detail suasana/analisis gambar, paragraf ketiga harapan/penutup."
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
        try {
            return JSON.parse(response.text);
        } catch (jsonError) {
             console.error("JSON Parse Error from AI:", jsonError);
             // Fallback if not valid JSON
             return {
                 summary: "Gagal memproses ringkasan otomatis.",
                 content: response.text
             };
        }
    }
    throw new Error("Gagal mendapatkan respons dari AI.");
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};
