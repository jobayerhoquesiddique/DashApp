import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/mock-data";

export function TopRegions() {
  const { data: regions = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/top-regions']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Top Regions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mr-3" />
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const colorClasses = [
    'bg-[hsl(221,83%,53%)]/10 text-[hsl(221,83%,53%)]',
    'bg-[hsl(188,95%,30%)]/10 text-[hsl(188,95%,30%)]', 
    'bg-[hsl(43,96%,56%)]/10 text-[hsl(43,96%,56%)]',
    'bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)]'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Top Regions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region: any, index: number) => (
            <div key={region.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${colorClasses[index % colorClasses.length]}`}>
                  <span className="text-sm font-medium">{region.code}</span>
                </div>
                <span className="text-gray-900 font-medium">{region.name}</span>
              </div>
              <span className="text-gray-600 font-medium">
                {formatCurrency(region.revenue)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
