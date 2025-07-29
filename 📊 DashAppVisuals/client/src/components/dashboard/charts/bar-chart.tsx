import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
}

const colors = [
  "hsl(221, 83%, 53%)",  // dashboard-primary
  "hsl(188, 95%, 30%)",  // dashboard-accent  
  "hsl(43, 96%, 56%)",   // dashboard-warning
  "hsl(142, 71%, 45%)",  // dashboard-success
  "hsl(0, 84%, 60%)"     // dashboard-error
];

export function DashboardBarChart({ data, title }: BarChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: colors[index % colors.length]
  }));

  const formatTooltip = (value: number) => {
    return [`$${(value / 1000).toFixed(0)}k`, "Sales"];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <Button variant="ghost" size="icon" className="p-1 text-gray-500 hover:text-[hsl(221,83%,53%)]">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
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
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                fill="hsl(221, 83%, 53%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
