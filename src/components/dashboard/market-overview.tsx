import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

const marketData = [
  {
    pair: 'BTC/USD',
    price: '68,450.72',
    change: '+2.34%',
    trend: 'up',
  },
  {
    pair: 'ETH/USD',
    price: '3,560.11',
    change: '+4.12%',
    trend: 'up',
  },
  {
    pair: 'SOL/USD',
    price: '168.45',
    change: '-1.05%',
    trend: 'down',
  },
  {
    pair: 'EUR/USD',
    price: '1.0856',
    change: '+0.15%',
    trend: 'up',
  },
];

export function MarketOverview() {
  return (
    <section>
      <h2 className="mb-4 font-headline text-2xl font-semibold">Market Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {marketData.map((data) => (
          <Card key={data.pair}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{data.pair}</CardTitle>
              {data.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.price}</div>
              <p className={`text-xs ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {data.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
