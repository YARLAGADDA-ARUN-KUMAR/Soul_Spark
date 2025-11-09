import { GoogleGenAI, Modality } from "@google/genai";
import { Mood } from '../types';
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateInspirationalContent = async (mood: Mood, prompt: string): Promise<string> => {
  try {
    const fullPrompt = `
      You are SoulSpark, an AI that generates creative and emotional content.
      The user is feeling "${mood}".
      Based on this mood and their specific request: "${prompt}", create a short, inspiring, and original piece of content.
      This could be a quote or a short poem (2-4 lines).
      Return only the generated content itself. Do not include any introductory text, author attribution, or quotation marks.
      The tone should be empathetic and perfectly match the user's mood.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    return "I'm sorry, I couldn't generate content at this moment. Please try again.";
  }
};

export const chatWithAI = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const systemInstruction = "You are SoulBot, a compassionate and supportive AI companion from the SoulSpark platform. Your role is to listen, offer comfort, and provide gentle guidance. Keep your responses concise, empathetic, and encouraging. Do not give medical advice. Use a warm and friendly tone.";

    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error in chat conversation:", error);
    return "I'm having a little trouble connecting right now. Let's try again in a moment.";
  }
};

export const generateBackgroundImage = async (content: string, mood: Mood): Promise<string> => {
  try {
    const prompt = `Create a visually stunning, emotionally resonant background image that captures the essence of the following text, which expresses a mood of ${mood}. The image should be abstract or scenic, suitable as a background for text. Do not include any text in the image. Text: "${content}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating background image:", error);
    throw new Error("Failed to generate an AI background. Please try again.");
  }
};