import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeServerFirebase } from '@/firebase/server-init';
import { getSharedPrices } from '@/lib/actions';
import { runGeminiWithFailover } from '@/ai/failover';

const mockSetups: Record<string, any[]> = {
  English: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "SMC order block mitigation at 4H support with bullish shift."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "Liquidity sweep at previous daily high followed by market structure shift."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "Clear breakout and retest of the descending wedge on high volume."
    }
  ],
  Arabic: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "تخفيف كتلة الطلب SMC عند دعم 4 ساعات مع تحول صعودي."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "سحب السيولة عند القمة اليومية السابقة متبوعاً بتحول في هيكل السوق."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "اختراق واضح وإعادة اختبار للوتد الهابط مع حجم تداول مرتفع."
    }
  ],
  Spanish: [
    {
      pair: "EUR/USD",
      type: "BUY",
      confidence: 85,
      entry: "1.0842",
      tp: "1.0920",
      sl: "1.0800",
      school: "ICT",
      reason: "Mitigación del bloque de orden SMC en soporte de 4H con cambio alcista."
    },
    {
      pair: "XAU/USD",
      type: "SELL",
      confidence: 78,
      entry: "2345.50",
      tp: "2320.00",
      sl: "2358.00",
      school: "SMC",
      reason: "Toma de liquidez en el máximo diario anterior seguido de un cambio estructural."
    },
    {
      pair: "BTC/USD",
      type: "BUY",
      confidence: 92,
      entry: "65200",
      tp: "68500",
      sl: "64100",
      school: "Price Action",
      reason: "Ruptura clara y retesteo de cuña descendente con alto volumen."
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    const language = lang === 'ar' ? 'Arabic' : lang === 'es' ? 'Spanish' : 'English';

    // 1. Fetch real-time prices to align setups perfectly with current market rates
    let livePrices: Record<string, number> = {
      'EUR/USD': 1.0854,
      'XAU/USD': 2320.50,
      'BTC/USD': 65200.00,
      'GBP/USD': 1.2710
    };

    try {
      const fetched = await getSharedPrices(['EUR/USD', 'XAU/USD', 'BTC/USD', 'GBP/USD']);
      if (fetched && Object.keys(fetched).length > 0) {
        livePrices = { ...livePrices, ...fetched };
      }
    } catch (priceError) {
      console.warn('[Top Setups] Could not fetch live prices, using default baselines:', priceError);
    }

    const priceContext = Object.entries(livePrices)
      .map(([pair, val]) => `${pair}: ${val}`)
      .join(', ');

    // Dynamic Mock Setups matching current live prices
    const dynamicMockSetups = {
      English: [
        {
          pair: "EUR/USD",
          type: "BUY",
          confidence: 85,
          entry: (livePrices['EUR/USD']).toFixed(4),
          tp: (livePrices['EUR/USD'] + 0.0075).toFixed(4),
          sl: (livePrices['EUR/USD'] - 0.0040).toFixed(4),
          school: "ICT",
          reason: "SMC order block mitigation at 4H support with bullish shift."
        },
        {
          pair: "XAU/USD",
          type: "SELL",
          confidence: 78,
          entry: (livePrices['XAU/USD']).toFixed(2),
          tp: (livePrices['XAU/USD'] - 25.50).toFixed(2),
          sl: (livePrices['XAU/USD'] + 12.50).toFixed(2),
          school: "SMC",
          reason: "Liquidity sweep at previous daily high followed by market structure shift."
        },
        {
          pair: "BTC/USD",
          type: "BUY",
          confidence: 92,
          entry: Math.round(livePrices['BTC/USD']).toString(),
          tp: Math.round(livePrices['BTC/USD'] + 3300).toString(),
          sl: Math.round(livePrices['BTC/USD'] - 1100).toString(),
          school: "Price Action",
          reason: "Clear breakout and retest of the descending wedge on high volume."
        }
      ],
      Arabic: [
        {
          pair: "EUR/USD",
          type: "BUY",
          confidence: 85,
          entry: (livePrices['EUR/USD']).toFixed(4),
          tp: (livePrices['EUR/USD'] + 0.0075).toFixed(4),
          sl: (livePrices['EUR/USD'] - 0.0040).toFixed(4),
          school: "ICT",
          reason: "تخفيف كتلة الطلب SMC عند دعم 4 ساعات مع تحول صعودي."
        },
        {
          pair: "XAU/USD",
          type: "SELL",
          confidence: 78,
          entry: (livePrices['XAU/USD']).toFixed(2),
          tp: (livePrices['XAU/USD'] - 25.50).toFixed(2),
          sl: (livePrices['XAU/USD'] + 12.50).toFixed(2),
          school: "SMC",
          reason: "سحب السيولة عند القمة اليومية السابقة متبوعاً بتحول في هيكل السوق."
        },
        {
          pair: "BTC/USD",
          type: "BUY",
          confidence: 92,
          entry: Math.round(livePrices['BTC/USD']).toString(),
          tp: Math.round(livePrices['BTC/USD'] + 3300).toString(),
          sl: Math.round(livePrices['BTC/USD'] - 1100).toString(),
          school: "Price Action",
          reason: "اختراق واضح وإعادة اختبار للوتد الهابط مع حجم تداول مرتفع."
        }
      ],
      Spanish: [
        {
          pair: "EUR/USD",
          type: "BUY",
          confidence: 85,
          entry: (livePrices['EUR/USD']).toFixed(4),
          tp: (livePrices['EUR/USD'] + 0.0075).toFixed(4),
          sl: (livePrices['EUR/USD'] - 0.0040).toFixed(4),
          school: "ICT",
          reason: "Mitigación del bloque de orden SMC en soporte de 4H con cambio alcista."
        },
        {
          pair: "XAU/USD",
          type: "SELL",
          confidence: 78,
          entry: (livePrices['XAU/USD']).toFixed(2),
          tp: (livePrices['XAU/USD'] - 25.50).toFixed(2),
          sl: (livePrices['XAU/USD'] + 12.50).toFixed(2),
          school: "SMC",
          reason: "Toma de liquidez en el máximo diario anterior seguido de un cambio estructural."
        },
        {
          pair: "BTC/USD",
          type: "BUY",
          confidence: 92,
          entry: Math.round(livePrices['BTC/USD']).toString(),
          tp: Math.round(livePrices['BTC/USD'] + 3300).toString(),
          sl: Math.round(livePrices['BTC/USD'] - 1100).toString(),
          school: "Price Action",
          reason: "Ruptura clara y retesteo de cuña descendente con alto volumen."
        }
      ]
    };

    // 2. Directly return dynamic mock setups to bypass Gemini API consumption
    const setups = dynamicMockSetups[language] || dynamicMockSetups.English;
    return NextResponse.json({ setups });
  } catch (error) {
    console.error('Top setups error:', error);
    return NextResponse.json(
      { error: 'Failed to generate setups' },
      { status: 500 }
    );
  }
}
