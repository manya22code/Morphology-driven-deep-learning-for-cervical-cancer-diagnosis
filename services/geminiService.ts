import { GoogleGenAI } from "@google/genai";
import { ModelType } from '../types';

const getSystemInstruction = (): string => {
  // Simplified and direct instruction to prevent model confusion and misclassification.
  // Removed the persona and accuracy details which were causing inverted results.
  return "You are an expert AI specializing in cervical cancer diagnosis from cytology images. Your task is to analyze the provided image and classify it into one of the following exact categories: 'Normal Cell', 'Cancerous Cell - cervix_dyk', 'Cancerous Cell - cervix_koc', 'Cancerous Cell - cervix_mep', or 'Cancerous Cell - cervix_pab'. You must respond with only the classification name and nothing else. Do not add any extra text, descriptions, or explanations.";
};

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

export const getDiagnosis = async (base64ImageData: string, mimeType: string, modelType: ModelType): Promise<string> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const imagePart = {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      };
      
      const prompt = "Classify the provided cervical cytology image.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{text: prompt}, imagePart] },
        config: {
          systemInstruction: getSystemInstruction(),
        },
      });

      const text = response.text.trim();
      const validClasses = ['Normal Cell', 'Cancerous Cell - cervix_dyk', 'Cancerous Cell - cervix_koc', 'Cancerous Cell - cervix_mep', 'Cancerous Cell - cervix_pab'];
      if (validClasses.some(c => text.includes(c))) {
          return text;
      }
      console.warn(`Unexpected classification from model: "${text}"`);
      return "Classification unclear";
    } catch (error: any) {
      lastError = error;
      const errorMessage = JSON.stringify(error).toLowerCase();
      const isRetriable = errorMessage.includes('503') || errorMessage.includes('unavailable') || errorMessage.includes('overloaded');

      if (isRetriable && attempt < MAX_RETRIES - 1) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
        console.log(`Model is overloaded. Retrying in ${delay}ms... (Attempt ${attempt + 2}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Not a retriable error or last attempt, so break and throw.
        break;
      }
    }
  }

  console.error(`Error with Gemini API for model type ${modelType} after ${MAX_RETRIES} attempts:`, lastError);
  
  const finalErrorMessage = JSON.stringify(lastError).toLowerCase();
  if (finalErrorMessage.includes('503') || finalErrorMessage.includes('unavailable') || finalErrorMessage.includes('overloaded')) {
    throw new Error('The AI model is temporarily overloaded. Please try again in a few moments.');
  }

  throw new Error('The AI model failed to provide a diagnosis.');
};