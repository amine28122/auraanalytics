'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';
import { z } from 'zod';
import { runGeminiWithFailover } from '@/ai/failover';

const GenerateTradeSignalsInputSchema = z.object({
  chartDataLarge: z.string(),
  chartDataSmall: z.string().optional(),
  language: z.enum(['en', 'ar', 'es']).default('en'),
  analysisSchools: z.array(z.string()).optional(),
  tradingBalance: z.number().optional(),
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

const DrawLevelSchema = z.object({
  type: z.enum(['entry', 'tp', 'sl', 'support', 'resistance']),
  price: z.string(),
  position: z.number().min(0).max(100),
});

const SchoolInsightSchema = z.object({
  school: z.string(),
  insight: z.string(),
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
  drawLevels: z.array(DrawLevelSchema).optional(),
  schoolInsights: z.array(SchoolInsightSchema).optional(),
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

  const promptParts: Part[] = [
    { text: `You are a world-class financial and economic market analyst with institutional trading discipline. Your task is to analyze the provided chart image(s) and generate actionable, structured trading signals.\n\n        **IMPORTANT FIRST STEP: Image Validation**\n        1.  First, analyze the image provided in 'chartDataLarge'.\n        2.  Determine if the image is a financial chart. If it is NOT a financial chart (e.g., it's a picture of a car, an animal, a person, etc.), you MUST set 'isChart' to false and provide an appropriate error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.\n        3.  If it IS a chart, determine if it is clear enough to be analyzed. If the chart is too blurry, pixelated, or the numbers and candlesticks are unreadable, you MUST set 'isClear' to false and provide an error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.\n        4.  If the image is a clear financial chart, set both 'isChart' and 'isClear' to true and proceed with the full analysis below. Also identify (if visible) the exact trading instrument/pair and the chart's timeframe.\n\n        The user's preferred language is ${validatedInput.language}. ALL text in your response, especially in the 'analysisSummary' and 'validationError' fields, MUST be in this language.\n\n` },
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
      {
        text: `\n\n**Analysis Instructions (Multi-Timeframe):**\n            1.  Use the Main Chart (Large Timeframe) to determine the overall market context, trend direction, and key higher-timeframe support/resistance zones. This chart dictates the STRATEGY (i.e., are we looking for buys or sells?).\n            2.  Use the Entry Chart (Small Timeframe) to find a precise, low-risk entry point that aligns with the strategy from the large timeframe. Look for confirmation patterns (e.g., candlestick patterns, break of structure) on this smaller chart.\n            3.  The final signal(s) must be based on a confluence between BOTH timeframes. If they conflict, state that in the summary and lower the confidence.\n            4.  **STRICT RISK MANAGEMENT:** Your Stop Loss (SL) MUST be tight and professional. **MANDATORY PROFESSIONAL RISK:** The SL MUST be tight, placed just beyond the NEAREST logical invalidation structure on the Small Timeframe (recent swing high/low, order block, or swept liquidity). Realistic tight SL distances: Forex 10-25 pips, Gold $3-$10, Stocks 0.3%-1.5%, Crypto 0.5%-2% from entry. NEVER give a wide/distant SL. Minimum Risk-to-Reward 1:2 (preferably 1:3). For every drawn level, provide 'position' as the vertical percentage of the image (0 = top, 100 = bottom).` }
    );
  } else {
    promptParts.push(
      {
        text: `\n\n**Analysis Instructions (Single Timeframe):**\n            1.  Perform a full analysis based on the single chart provided. Identify the trend, key levels, and any potential patterns to form your conclusion.\n            2.  **RISK MANAGEMENT:** **MANDATORY PROFESSIONAL RISK:** The Stop Loss MUST be tight and placed just beyond the NEAREST logical invalidation structure (recent swing high/low, order block, or swept liquidity). Realistic tight SL distances: Forex 10-25 pips, Gold/XAUUSD $3-$10, Stocks 0.3%-1.5%, Crypto 0.5%-2% from entry. NEVER give a wide/distant SL - a professional SL is a precise technical invalidation point, not a safety net. Aim for a minimum Risk-to-Reward of 1:2 (preferably 1:3) with take-profits at realistic structural targets. For every drawn level, provide its 'position' as the vertical percentage of the image (0 = top edge, 100 = bottom edge).` }
    );
  }

  if (validatedInput.tradingBalance) {
    promptParts.push({
      text: `\n\n**CRITICAL RISK MANAGEMENT REQUIREMENT:** The user's trading account balance is ONLY $${validatedInput.tradingBalance}. You MUST calculate realistic risk parameters and a strict Stop Loss based specifically on this capital size. **BALANCE-ADAPTIVE RISK ENGINE (CRITICAL):** Scale your execution precision and stop-loss exactly like a professional prop-firm desk:\n- Balance < $50: micro account - ultra-tight SL (a few cents / micro-pips), only 1-3 high-quality trades, small compounding targets, capital preservation above all.\n- $50-$1,000: retail pro - tight SL (Forex 10-20 pips, Gold $3-$7), minimum R:R 1:2, skip weak setups.\n- $1,000-$10,000: institutional precision - SL strictly at structural invalidation, require multi-timeframe confluence, minimum R:R 1:2.5.\n- Above $10,000: fund-level discipline - tight structural SL, capital preservation first, only A+ setups, target R:R >= 1:3.\nThe larger the balance, the smarter and stricter the execution - the SL must ALWAYS be CLOSE to entry (just beyond invalidation), never far. Mention in ONE short line in 'analysisSummary' how the balance shaped the SL.`
    });
  }

  promptParts.push(
    {
      text: `\n\nBased on your integrated analysis, provide the following output in a valid JSON format.\n\n**CRITICAL FORMATTING RULES:**
- Every signal in the \"signals\" array **MUST** have a \"type\" field with a value of either \"BUY\" or \"SELL\". This is mandatory.
- All price values (entryPrice, takeProfit, stopLoss) **MUST** be formatted as **strings**. For example: \"1.2345\".

**Response Schema:**
1.  **analysisSummary**: A CONCISE technical & economic summary (maximum 4 short sentences) in the user's language: the trade premise, the structure behind the entry, the tight invalidation/SL logic, and one short line on how the balance shaped the SL. No filler words.
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
6.  **drawLevels**: Array of levels to draw ON the chart screenshot. For EVERY entry/TP/SL of every signal, plus the key support/resistance levels, add an item:
    - **type**: one of "entry", "tp", "sl", "support", "resistance".
    - **price**: the level price as a string.
    - **position**: number 0-100 = the vertical position where this level sits ON THE IMAGE (0 = top edge of the screenshot, 100 = bottom edge). Use your vision - it MUST match where the level appears on the chart.
7.  **schoolInsights**: Array of insights for the selected/persona schools:
    - **school**: the school name.
    - **insight**: one short, specific insight about THIS chart through that school's lens (max ~18 words).

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

  return await runGeminiWithFailover(async (genAI) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }], generationConfig, safetySettings });
    const responseText = result.response.text();
    const parsedOutput = JSON.parse(responseText);
    return GenerateTradeSignalsOutputSchema.parse(parsedOutput);
  });
}
