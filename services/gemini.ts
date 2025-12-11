import { GoogleGenAI } from "@google/genai";
import { GenerationRequest } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key eksik. Lütfen ortam değişkenlerini kontrol edin.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateContent = async (request: GenerationRequest): Promise<string> => {
    try {
        const ai = getClient();
        let prompt = "";
        
        // System instruction styled prompt based on type
        switch (request.type) {
            case 'outline':
                prompt = `Bir öğretmen olarak, şu konu hakkında detaylı bir ders planı veya makale taslağı oluştur: "${request.topic}". Başlıklar ve alt başlıklar kullan.`;
                break;
            case 'article':
                prompt = `Bir öğretmen olarak, şu konu hakkında SEO uyumlu, bilgilendirici ve öğrenciler için anlaşılır bir blog yazısı yaz: "${request.topic}". Markdown formatında yaz.`;
                break;
            case 'seo':
                prompt = `Şu makale başlığı veya konusu için SEO Başlığı (Title), Meta Açıklaması (Description) ve Anahtar Kelimeler (Keywords) oluştur: "${request.topic}". JSON formatında döndür: {"title": "", "description": "", "keywords": ""}`;
                break;
            default:
                prompt = request.topic;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "";
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return "İçerik oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.";
    }
};