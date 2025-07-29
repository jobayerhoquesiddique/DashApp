import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

export function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const isPositive = trend === "up";
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-2 bg-[hsl(221,83%,53%)]/10 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(parseFloat(change))}%</span>
          </span>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
