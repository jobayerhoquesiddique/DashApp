import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
}

export function DashboardLineChart({ data, title }: LineChartProps) {
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value
  }));

  const formatTooltip = (value: number) => {
    return [`$${(value / 1000).toFixed(0)}k`, "Revenue"];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="px-3 py-1 bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
              7D
            </Button>
            <Button variant="ghost" size="sm" className="px-3 py-1">
              30D
            </Button>
            <Button variant="ghost" size="sm" className="px-3 py-1">
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(221, 83%, 53%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(221, 83%, 53%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
