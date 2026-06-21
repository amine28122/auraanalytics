import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeServerFirebase } from '@/firebase/server-init';
import { runGeminiWithFailover } from '@/ai/failover';

const mockBriefs: Record<string, string> = {
  English: `Markets are trading in a mixed sentiment ahead of today's key economic releases.
• DXY: Consolidating near 104.20, trading inside the daily institutional order block.
• Gold: Bouncing off key support at $2,320, searching for a high-timeframe liquidity sweep.
• EUR/USD: Lower daily highs suggest a bearish bias, targeting the 1.0810 sell-side liquidity.
• Bitcoin: Consolidating around $65,500, sustaining support at the 200-day moving average.
Strategic Insight: Maintain patience and wait for liquidity sweep confirmations before committing to new positions.`,
  Arabic: `تتداول الأسواق في حالة من التباين في المشاعر قبيل صدور البيانات الاقتصادية الرئيسية اليوم.
• DXY: يتconsolidate بالقرب من 104.20، ويتداول داخل بلوك الطلب المؤسساتي اليومي.
• الذهب: يرتد من مستويات دعم رئيسية عند 2,320 دولار، بحثاً عن سحب السيولة على الفريمات الكبيرة.
• EUR/USD: القمم اليومية الهابطة تشير إلى انحياز بيعي، مستهدفة سيولة البيع عند 1.0810.
• البيتكوين: يتماسك حول 65,500 دولار، محتفظاً بالدعم فوق المتوسط المتحرك لـ 200 يوم.
رؤية استراتيجية: حافظ على الصبر وانتظر تأكيدات سحب السيولة قبل الدخول في صفقات جديدة.`,
  Spanish: `Los mercados cotizan con un sentimiento mixto antes de las publicaciones económicas clave de hoy.
• DXY: Consolidándose cerca de 104.20, cotizando dentro del bloque de orden institucional diario.
• Oro: Rebotando en el soporte clave de $2,320, buscando una toma de liquidez en marcos de tiempo altos.
• EUR/USD: Los máximos diarios decrecientes sugieren un sesgo bajista, apuntando a la liquidez en 1.0810.
• Bitcoin: Consolidándose alrededor de $65,500, manteniendo el soporte en el promedio móvil de 200 días.
Perspectiva Estratégica: Mantenga la paciencia y espere confirmaciones de toma de liquidez antes de abrir nuevas posiciones.`
};

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    const language = lang === 'ar' ? 'Arabic' : lang === 'es' ? 'Spanish' : 'English';

    const todayDate = new Date();
    // Use YYYY-MM-DD in UTC to ensure consistency across users
    const dateStr = todayDate.toISOString().split('T')[0];
    const docId = `${dateStr}_${lang || 'en'}`;

    // 2. Directly return mock brief to bypass Gemini API consumption
    const brief = mockBriefs[language] || mockBriefs.English;
    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Morning intel error:', error);
    return NextResponse.json(
      { error: 'Failed to generate briefing' },
      { status: 500 }
    );
  }
}
