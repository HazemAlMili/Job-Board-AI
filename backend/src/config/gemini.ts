import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

function createGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not set. AI evaluation will not work.');
    return null;
  }

  console.log('✅ Gemini AI client initialized successfully');
  return new GoogleGenerativeAI(apiKey);
}

export const geminiClient = createGeminiClient();

export const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const aiScoreThreshold = parseInt(process.env.AI_SCORE_THRESHOLD || '5', 10);
