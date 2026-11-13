import { GoogleGenAI } from '@google/genai';

/**
 * Parses the GEMINI_API_KEY environment variable.
 * Supports a single key OR multiple keys separated by commas for automatic rotation and failover.
 */
export function getGeminiKeys(): string[] {
  const raw = process.env.GEMINI_API_KEY || "";
  return raw.split(',').map(k => k.trim()).filter(Boolean);
}

/**
 * Runs a Gemini API function with automatic failover across multiple keys.
 * If a key fails with a 429 Rate Limit / Quota Exceeded error, it automatically tries the next key in the pool.
 */
export async function runGeminiWithFailover<T>(
  fn: (ai: GoogleGenAI) => Promise<T>
): Promise<T> {
  const keys = getGeminiKeys();
  if (keys.length === 0) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  let lastError: any = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const result = await fn(ai);
      
      // If we used a key other than the first one, log it for monitoring
      if (i > 0) {
        console.log(`[Gemini Failover] Success using failover key index ${i} (starts with ${key.substring(0, 8)}...)`);
      }
      
      return result;
    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.warn(`[Gemini Failover] Key index ${i} failed (starts with ${key.substring(0, 8)}...):`, errMsg);
      lastError = err;

      // Check if the error is due to rate limits (429) or quota limits
      const isRateLimit = 
        err.status === 429 || 
        errMsg.includes('429') || 
        errMsg.toLowerCase().includes('quota') || 
        errMsg.toLowerCase().includes('limit');

      if (isRateLimit && i < keys.length - 1) {
        console.warn(`[Gemini Failover] Rate limit reached. Rotating to key index ${i + 1}...`);
        continue;
      }
      
      // If it's a generic error or the last key, break and throw
      break;
    }
  }

  throw lastError || new Error("All Gemini API keys in the pool failed.");
}
