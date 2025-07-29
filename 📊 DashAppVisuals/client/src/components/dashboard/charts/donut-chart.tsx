import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
}

const colors = [
  "hsl(221, 83%, 53%)",  // dashboard-primary
  "hsl(188, 95%, 30%)",  // dashboard-accent  
  "hsl(43, 96%, 56%)",   // dashboard-warning
];

export function DonutChart({ data, title }: DonutChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    color: colors[index % colors.length]
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, '']}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(0);
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
