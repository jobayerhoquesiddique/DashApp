import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/dashboard/header";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DashboardLineChart } from "@/components/dashboard/charts/line-chart";
import { DashboardBarChart } from "@/components/dashboard/charts/bar-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { TopRegions } from "@/components/dashboard/top-regions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { DashboardFilters } from "@/types/dashboard";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<DashboardFilters>({
    category: 'all',
    region: 'all',
    search: '',
    dateRange: '7d'
  });

  // Fetch dashboard data
  const { data: metrics = [], isLoading: metricsLoading } = useQuery<any[]>({
    queryKey: ['/api/metrics']
  });

  const { data: revenueData = [], isLoading: revenueLoading } = useQuery<any[]>({
    queryKey: ['/api/chart-data/revenue']
  });

  const { data: categoryData = [], isLoading: categoryLoading } = useQuery<any[]>({
    queryKey: ['/api/chart-data/category']
  });

  const { data: customerData = [], isLoading: customerLoading } = useQuery<any[]>({
    queryKey: ['/api/chart-data/customer']
  });

  // Refresh data mutation
  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/refresh'),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFiltersChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically through the transactions table
    toast({
      title: "Filters applied",
      description: "Dashboard has been updated with your filters.",
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      region: 'all',
      search: '',
      dateRange: '7d'
    });
    toast({
      title: "Filters reset",
      description: "All filters have been cleared.",
    });
  };

  const handleDateRangeChange = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  // Transform data for charts
  const revenueChartData = revenueData.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value)
  }));

  const categoryChartData = categoryData.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value)
  }));

  const customerChartData = customerData.map((item: any) => ({
    label: item.label,
    value: parseFloat(item.value)
  }));

  const kpiIcons = {
    'Total Revenue': <DollarSign className="w-5 h-5 text-[hsl(221,83%,53%)]" />,
    'New Customers': <Users className="w-5 h-5 text-[hsl(188,95%,30%)]" />,
    'Conversion Rate': <TrendingUp className="w-5 h-5 text-[hsl(43,96%,56%)]" />,
    'Avg Order Value': <ShoppingCart className="w-5 h-5 text-[hsl(142,71%,45%)]" />
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        onDateRangeChange={handleDateRangeChange}
        onRefresh={handleRefresh}
        isRefreshing={refreshMutation.isPending}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))
          ) : (
            metrics.map((metric: any) => (
              <KPICard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                change={metric.change}
                trend={metric.trend as "up" | "down"}
                icon={kpiIcons[metric.name as keyof typeof kpiIcons] || <DollarSign className="w-5 h-5" />}
              />
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {revenueLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          ) : (
            <DashboardLineChart 
              data={revenueChartData}
              title="Revenue Trends"
            />
          )}

          {categoryLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          ) : (
            <DashboardBarChart 
              data={categoryChartData}
              title="Sales by Category"
            />
          )}
        </div>

        {/* Secondary Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {customerLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </div>
          ) : (
            <DonutChart 
              data={customerChartData}
              title="Customer Distribution"
            />
          )}

          <TopRegions />
          <ActivityFeed />
        </div>

        {/* Transactions Table */}
        <TransactionsTable filters={filters} />
      </main>
    </div>
  );
}
