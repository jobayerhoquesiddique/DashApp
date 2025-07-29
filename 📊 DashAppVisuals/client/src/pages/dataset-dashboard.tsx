import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DashboardLineChart } from "@/components/dashboard/charts/line-chart";
import { DashboardBarChart } from "@/components/dashboard/charts/bar-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DollarSign, Users, TrendingUp, Database, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function DatasetDashboardPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: dataset, isLoading: datasetLoading } = useQuery<any>({
    queryKey: [`/api/datasets/${id}`],
    enabled: !!id
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<any>({
    queryKey: [`/api/datasets/${id}/dashboard`],
    enabled: !!id
  });

  if (datasetLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-80 bg-gray-200 rounded" />
              <div className="h-80 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dataset || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {!dataset ? "Dataset not found" : "Unable to generate dashboard"}
          </h1>
          <Button onClick={() => setLocation('/datasets')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Datasets
          </Button>
        </div>
      </div>
    );
  }

  const { metrics = [], charts = {} } = dashboardData;
  const { revenue = [], category = [], distribution = [] } = charts;

  // Transform data for charts
  const revenueChartData = revenue.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value) || 0
  }));

  const categoryChartData = category.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value) || 0
  }));

  const distributionChartData = distribution.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value) || 0
  }));

  const kpiIcons = [
    <Database className="w-5 h-5 text-[hsl(221,83%,53%)]" />,
    <TrendingUp className="w-5 h-5 text-[hsl(188,95%,30%)]" />,
    <Users className="w-5 h-5 text-[hsl(43,96%,56%)]" />,
    <DollarSign className="w-5 h-5 text-[hsl(142,71%,45%)]" />
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation(`/dataset/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-[hsl(221,83%,53%)]">
              {dataset.name} Dashboard
            </h1>
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 lg:p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.slice(0, 4).map((metric: any, index: number) => (
            <KPICard
              key={metric.id}
              title={metric.name}
              value={metric.value}
              change={metric.change}
              trend={metric.trend as "up" | "down"}
              icon={kpiIcons[index] || <Database className="w-5 h-5" />}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {revenueChartData.length > 0 && (
            <DashboardLineChart 
              data={revenueChartData}
              title="Data Trends"
            />
          )}

          {categoryChartData.length > 0 && (
            <DashboardBarChart 
              data={categoryChartData}
              title="Category Analysis"
            />
          )}
        </div>

        {/* Secondary Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {distributionChartData.length > 0 && (
            <DonutChart 
              data={distributionChartData}
              title="Data Distribution"
            />
          )}

          {/* Dataset Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rows:</span>
                  <span className="font-medium">{dataset.rowCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Columns:</span>
                  <span className="font-medium">{(dataset.columns as any[]).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File:</span>
                  <span className="font-medium text-sm">{dataset.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">
                    {((dataset.fileSize || 0) / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ActivityFeed />
        </div>

        {/* Empty State for No Charts */}
        {revenueChartData.length === 0 && categoryChartData.length === 0 && distributionChartData.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No charts available
            </h3>
            <p className="text-gray-600">
              This dataset doesn't contain data suitable for visualization. 
              Try uploading a dataset with numeric columns.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}