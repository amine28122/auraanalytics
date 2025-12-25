'use server';

/**
 * @fileOverview Generates trade signals based on market chart analysis.
 *
 * - generateTradeSignals - A function that generates trade signals.
 * - GenerateTradeSignalsInput - The input type for the generateTradeSignals function.
 * - GenerateTradeSignalsOutput - The return type for the generateTradeSignals function.
 */

import { ai } from '@/ai/init';
import {z} from 'genkit';

const GenerateTradeSignalsInputSchema = z.object({
  chartDataLarge: z
    .string()
    .describe(
      'The main chart data for a large timeframe (e.g., H4, Daily) as a data URI. Must include a MIME type and use Base64 encoding.'
    ),
  chartDataSmall: z
    .string()
    .optional()
    .describe(
      'Optional: Chart data for a smaller timeframe (e.g., M15, M5) for precise entry, as a data URI.'
    ),
  language: z.enum(['en', 'ar', 'es']).default('en').describe('The language for the analysis output.'),
  analysisSchools: z.array(z.string()).optional().describe('A list of specific technical analysis schools to focus on (e.g., ["ICT", "RSI"]).'),
});
export type GenerateTradeSignalsInput = z.infer<typeof GenerateTradeSignalsInputSchema>;

const TradeSignalSchema = z.object({
    type: z.enum(['BUY', 'SELL']).describe('The type of the signal (BUY or SELL).'),
    orderType: z.enum(['Market', 'Pending']).describe("'Market' for immediate execution at current price, 'Pending' for a future entry point."),
    entryPrice: z.string().describe("The recommended entry price. Should be 'Current Price' for Market orders."),
    takeProfit: z.array(z.string()).describe('An array of take-profit target prices.'),
    stopLoss: z.string().describe('The recommended stop-loss price. This should be a tight stop loss.'),
});

const GenerateTradeSignalsOutputSchema = z.object({
  imageValidation: z.object({
    isChart: z.boolean().describe("Set to true if the image is a financial chart. If it's not a chart (e.g., a photo of an animal), set to false and provide a validationError."),
    isClear: z.boolean().describe("Set to true if the chart is clear and readable. If it's too blurry or the numbers are unreadable, set to false and provide a validationError."),
    validationError: z.string().optional().describe("If isChart or isClear is false, provide a user-friendly error message in the requested language. E.g., 'The uploaded image is not a financial chart.' or 'The chart image is too blurry to analyze.'"),
  }).describe('Result of the initial image validation.'),
  signals: z.array(TradeSignalSchema).optional().describe('An array of potential trading signals, both buy and sell.'),
  supportLevels: z.array(z.string()).optional().describe('Key support price levels identified from the chart.'),
  resistanceLevels: z.array(z.string()).optional().describe('Key resistance price levels identified from the chart.'),
  confidenceLevel: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('Confidence level of the signals (0 to 1).'),
  analysisSummary: z.string().optional().describe('A detailed summary of the technical analysis, including identified patterns, trend direction, and rationale for the signals.'),
});
export type GenerateTradeSignalsOutput = z.infer<typeof GenerateTradeSignalsOutputSchema>;
export type TradeSignal = z.infer<typeof TradeSignalSchema>;


export async function generateTradeSignals(input: GenerateTradeSignalsInput): Promise<GenerateTradeSignalsOutput> {
  return generateTradeSignalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradeSignalsPrompt',
  model: 'gemini-2.5-flash',
  input: {schema: GenerateTradeSignalsInputSchema},
  output: {schema: GenerateTradeSignalsOutputSchema},
  prompt: `You are a professional trading analyst specializing in multi-timeframe technical analysis. Your task is to analyze the provided chart image(s) and generate actionable, structured trading signals.

  **IMPORTANT FIRST STEP: Image Validation**
  1.  First, analyze the image provided in 'chartDataLarge'.
  2.  Determine if the image is a financial chart. If it is NOT a financial chart (e.g., it's a picture of a car, an animal, a person, etc.), you MUST set 'isChart' to false and provide an appropriate error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.
  3.  If it IS a chart, determine if it is clear enough to be analyzed. If the chart is too blurry, pixelated, or the numbers and candlesticks are unreadable, you MUST set 'isClear' to false and provide an error message in the 'validationError' field, in the requested language. Do not proceed with any analysis.
  4.  If the image is a clear financial chart, set both 'isChart' and 'isClear' to true and proceed with the full analysis below.

  The user's preferred language is {{language}}. ALL text in your response, especially in the 'analysisSummary' and 'validationError' fields, MUST be in this language.

  {{#if analysisSchools.length}}
  The user has requested to focus the analysis primarily on the following schools/concepts: **{{#each analysisSchools}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}**.
  Your analysis should prioritize these methods. If other powerful patterns are present, you may mention them, but the core rationale should stem from the user's selected schools. If the selected schools are not applicable to the provided chart, state that in the summary.
  {{else}}
  Your analysis MUST be comprehensive and draw upon a variety of powerful technical analysis schools, including:
  - ICT / SMC (Inner Circle Trader / Smart Money Concepts)
  - Elliott Wave Theory
  - Support & Resistance
  - Trend Lines & Channels
  - Chart Patterns (e.g., head and shoulders, double tops/bottoms, triangles)
  - Japanese Candlesticks
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Fibonacci
  - Quantitative Analysis
  {{/if}}
  

  Analyze the following chart data:

  Main Chart (Large Timeframe): {{media url=chartDataLarge}}
  {{#if chartDataSmall}}
  Entry Chart (Small Timeframe): {{media url=chartDataSmall}}
  
  **Analysis Instructions (Multi-Timeframe):**
  1.  Use the Main Chart (Large Timeframe) to determine the overall market context, trend direction, and key higher-timeframe support/resistance zones. This chart dictates the STRATEGY (i.e., are we looking for buys or sells?).
  2.  Use the Entry Chart (Small Timeframe) to find a precise, low-risk entry point that aligns with the strategy from the large timeframe. Look for confirmation patterns (e.g., candlestick patterns, break of structure) on this smaller chart.
  3.  The final signal(s) must be based on a confluence between BOTH timeframes. If they conflict, state that in the summary and lower the confidence.
  {{else}}
  **Analysis Instructions (Single Timeframe):**
  1.  Perform a full analysis based on the single chart provided. Identify the trend, key levels, and any potential patterns to form your conclusion.
  {{/if}}

  Based on your integrated analysis, provide the following:
  1.  A detailed technical analysis summary. If using multi-timeframe, explain how the large timeframe context justifies the entry on the small timeframe. The summary MUST reflect the user's chosen analysis schools if provided.
  2.  Identify key support and resistance levels from the main chart.
  3.  Generate potential trading signals (both buy and sell if applicable).
      - For each signal, determine if it's a 'Market' order or a 'Pending' order.
      - Specify the entry price. Use 'Current Price' for Market orders.
      - Provide at least one take-profit (TP) level.
      - Provide a tight stop-loss (SL) level to minimize potential risk.
  4.  A confidence level for the overall analysis. This should be higher if both timeframes are in alignment.

  Format your output as a JSON object matching the requested schema. Provide specific price points for all signals. Ensure stop losses are reasonably tight. If validation fails, only populate the 'imageValidation' object.`,
});

const generateTradeSignalsFlow = ai.defineFlow(
  {
    name: 'generateTradeSignalsFlow',
    inputSchema: GenerateTradeSignalsInputSchema,
    outputSchema: GenerateTradeSignalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
