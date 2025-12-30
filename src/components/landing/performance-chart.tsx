'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

export default function PerformanceChart() {
  const { t } = useLanguage();

  const comparisonData = [
    { feature: t.depth, aura: 95, other: 40 },
    { feature: t.clarity, aura: 92, other: 65 },
    { feature: t.accuracy, aura: 88, other: 50 },
    { feature: t.ux, aura: 90, other: 70 },
  ];

  const chartConfig = {
    aura: {
      label: "AURA",
      color: "hsl(var(--primary))",
    },
    other: {
      label: t.typical_app,
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig;

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="container mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">{t.why_aura_excels}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{t.visual_comparison}</p>
        </div>

        <Card className="w-full max-w-4xl card-glow bg-muted">
          <CardContent className="p-4 sm:p-6">
            <ChartContainer config={chartConfig} className="min-h-64 w-full">
              <BarChart accessibilityLayer data={comparisonData}>
                <XAxis
                  dataKey="feature"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => value.slice(0, 15)}
                />
                <YAxis hide={true} domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="aura" fill="var(--color-aura)" radius={5} />
                <Bar dataKey="other" fill="var(--color-other)" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
