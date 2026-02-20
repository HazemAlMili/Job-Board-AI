import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function createOpenRouterClient(): OpenAI | null {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn('WARNING: OPENROUTER_API_KEY is not set. AI evaluation will not work.');
    return null;
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173', // Optional, for OpenRouter rankings
      'X-Title': 'Hireny AI Job Board', // Optional, for OpenRouter rankings
    }
  });
}

export const openrouterClient = createOpenRouterClient();
export const openrouterModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
