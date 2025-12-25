import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not found in environment variables.");
}

// Initialize Genkit with a single, definitive configuration.
export const ai = genkit({
    plugins: [googleAI({ apiKey: API_KEY })],
});
