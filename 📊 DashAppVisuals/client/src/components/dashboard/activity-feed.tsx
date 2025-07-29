import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getTimeAgo } from "@/lib/mock-data";

export function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/activities']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 animate-pulse" />
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-[hsl(142,71%,45%)]';
      case 'info':
        return 'bg-[hsl(221,83%,53%)]';
      case 'warning':
        return 'bg-[hsl(43,96%,56%)]';
      case 'error':
        return 'bg-[hsl(0,84%,60%)]';
      default:
        return 'bg-[hsl(188,95%,30%)]';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
