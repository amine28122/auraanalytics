'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';
import { z } from 'zod';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not found in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const GenerateTradeSignalsInputSchema = z.object({
  chartDataLarge: z.string(),
  chartDataSmall: z.string().optional(),
  language: z.enum(['en', 'ar', 'es']).default('en'),
  analysisSchools: z.array(z.string()).optional(),
});
export type GenerateTradeSignalsInput = z.infer<typeof GenerateTradeSignalsInputSchema>;

const TradeSignalSchema = z.object({
  pair: z.string(),
  type: z.enum(['BUY', 'SELL']),
  orderType: z.enum(['Market', 'Pending']),
  entryPrice: z.string(),
  takeProfit: z.array(z.string()),
  stopLoss: z.string(),
});

const GenerateTradeSignalsOutputSchema = z.object({
  imageValidation: z.object({
    isChart: z.boolean(),
    isClear: z.boolean(),
    validationError: z.string().optional().nullable(),
  }),
  signals: z.array(TradeSignalSchema).optional(),
  supportLevels: z.array(z.string()).optional(),
  resistanceLevels: z.array(z.string()).optional(),
  confidenceLevel: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const num = parseFloat(val);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z.number().optional()
  ),
  analysisSummary: z.string().optional(),
});
export type GenerateTradeSignalsOutput = z.infer<typeof GenerateTradeSignalsOutputSchema>;
export type TradeSignal = z.infer<typeof TradeSignalSchema>;

function dataUriToGoogleGenerativePart(dataUri: string): Part {
  const [mimeTypePart, base64Part] = dataUri.split(';base64,');
  const mimeType = mimeTypePart.split(':')[1];
  return {
    inlineData: {
      mimeType,
      data: base64Part,
    },
  };
}

export async function generateTradeSignals(input: GenerateTradeSignalsInput): Promise<GenerateTradeSignalsOutput> {
  const validatedInput = GenerateTradeSignalsInputSchema.parse(input);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const promptParts: Part[] = [
    { text: `You are a professional trading analyst. Your task is to analyze the provided chart image(s) and generate actionable, structured trading signals.\n\n        **IMPORTANT FIRST STEP: Image Validation**\n        1.  First, analyze the image provided in 'chartDataLarge'.\n        2.  Determine if the image is a financial chart. If it is NOT a financial chart (e.g., it's a picture of a car, an animal, a person, etc.), you MUST set 'isChart' to false and provide an appropriate error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.\n        3.  If it IS a chart, determine if it is clear enough to be analyzed. If the chart is too blurry, pixelated, or the numbers and candlesticks are unreadable, you MUST set 'isClear' to false and provide an error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.\n        4.  If the image is a clear financial chart, set both 'isChart' and 'isClear' to true and proceed with the full analysis below.\n\n        The user's preferred language is ${validatedInput.language}. ALL text in your response, especially in the 'analysisSummary' and 'validationError' fields, MUST be in this language.\n\n` },
    {
      text: validatedInput.analysisSchools && validatedInput.analysisSchools.length > 0 ?
        `For this analysis, you MUST adopt the persona of a world-class specialist ONLY in the following trading schools/concepts: **${validatedInput.analysisSchools.join(', ')}**. Your ENTIRE analysis, from identifying levels to generating signals and writing the summary, MUST be conducted *exclusively* through the lens of this/these methodologies. Do not use concepts from other schools unless they are directly part of the requested ones. Your persona is that of a master analyst who is a leading expert in the selected schools. If the chart does not present a clear setup according to these specific schools, you must state that in the analysis summary and lower the confidence level accordingly.`
        :
        `Your persona is that of a comprehensive technical analyst. Your analysis MUST be holistic and draw upon a variety of powerful technical analysis schools, including:\n- ICT / SMC (Inner Circle Trader / Smart Money Concepts)\n- Elliott Wave Theory\n- Support & Resistance\n- Trend Lines & Channels\n- Chart Patterns (e.g., head and shoulders, double tops/bottoms, triangles)\n- Japanese Candlesticks\n- RSI (Relative Strength Index)\n- MACD (Moving Average Convergence Divergence)\n- Fibonacci\n- Quantitative Analysis`
    },
    { text: `\n\nAnalyze the following chart data:\n        ` },
    dataUriToGoogleGenerativePart(validatedInput.chartDataLarge),
  ];

  if (validatedInput.chartDataSmall) {
    promptParts.push(
      { text: '\n\nEntry Chart (Small Timeframe):\n' },
      dataUriToGoogleGenerativePart(validatedInput.chartDataSmall),
      { text: `\n\n**Analysis Instructions (Multi-Timeframe):**\n            1.  Use the Main Chart (Large Timeframe) to determine the overall market context, trend direction, and key higher-timeframe support/resistance zones. This chart dictates the STRATEGY (i.e., are we looking for buys or sells?).\n            2.  Use the Entry Chart (Small Timeframe) to find a precise, low-risk entry point that aligns with the strategy from the large timeframe. Look for confirmation patterns (e.g., candlestick patterns, break of structure) on this smaller chart.\n            3.  The final signal(s) must be based on a confluence between BOTH timeframes. If they conflict, state that in the summary and lower the confidence.` }
    );
  } else {
    promptParts.push(
      { text: `\n\n**Analysis Instructions (Single Timeframe):**\n            1.  Perform a full analysis based on the single chart provided. Identify the trend, key levels, and any potential patterns to form your conclusion.` }
    );
  }

  promptParts.push(
    {
      text: `\n\nBased on your integrated analysis, provide the following output in a valid JSON format.\n\n**CRITICAL FORMATTING RULES:**
- Every signal in the \"signals\" array **MUST** have a \"type\" field with a value of either \"BUY\" or \"SELL\". This is mandatory.
- All price values (entryPrice, takeProfit, stopLoss) **MUST** be formatted as **strings**. For example: \"1.2345\".

**Response Schema:**
1.  **analysisSummary**: A detailed technical analysis summary. Explain your reasoning based on the chosen analysis school.
2.  **supportLevels**: An array of key support level strings (e.g., [\"150.00\", \"148.50\"])
3.  **resistanceLevels**: An array of key resistance level strings (e.g., [\"152.00\", \"153.50\"])
4.  **signals**: An array of signal objects. **You MUST attempt to generate at least one signal.** If the setup is weak, reflect it in the confidenceLevel and summary. A signal object has the following structure:
    - **pair**: MANDATORY. The trading pair/symbol identified (e.g., "XAU/USD").
    - **type**: MANDATORY. Must be "BUY" or "SELL".
    - **orderType**: "Market" or "Pending".
    - **entryPrice**: The entry price as a string (e.g., \"1.12345\"). Use \"Current Price\" for Market orders.
    - **takeProfit**: An array of take-profit levels as strings (e.g., [\"1.12500\", \"1.12750\"]).
    - **stopLoss**: The stop-loss level as a string (e.g., \"1.12000\").
5.  **confidenceLevel**: A number between 0 and 1 representing your confidence in the analysis.

**Final Instruction**: Generate the JSON output. If no valid trading setup can be identified at all, you may return an empty \"signals\" array, but you MUST explain why in the \"analysisSummary\". If validation fails, only populate the 'imageValidation' object.`}
  );

  const generationConfig = {
    responseMimeType: "application/json",
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }], generationConfig, safetySettings });
  const responseText = result.response.text();

  const parsedOutput = JSON.parse(responseText);

  return GenerateTradeSignalsOutputSchema.parse(parsedOutput);
}
