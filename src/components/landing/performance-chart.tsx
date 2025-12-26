'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';

const comparisonData = [
  { feature: "Strategy Depth", aura: 95, other: 40 },
  { feature: "Signal Clarity", aura: 92, other: 65 },
  { feature: "Analysis Accuracy", aura: 88, other: 50 },
  { feature: "User Experience", aura: 90, other: 70 },
];

const chartConfig = {
  aura: {
    label: "AURA",
    color: "hsl(var(--primary))",
  },
  other: {
    label: "Typical Signals App",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export default function PerformanceChart() {
  return (
    <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto flex flex-col items-center gap-8">
             <div className="text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Why AURA Excels</h2>
                <p className="mt-2 text-lg text-muted-foreground">A visual comparison of our core strengths.</p>
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
