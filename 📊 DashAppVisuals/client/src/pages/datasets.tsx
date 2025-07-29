import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  Database,
  Plus
} from "lucide-react";
import { useLocation } from "wouter";
import { formatDate } from "@/lib/mock-data";

export default function DatasetsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: datasets = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/datasets']
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Dataset deleted",
        description: "Dataset has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete dataset "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Datasets</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
                    <div className="h-9 w-full bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Datasets</h1>
            <p className="text-gray-600">
              Manage your uploaded datasets and generate dashboards
            </p>
          </div>
          <Button
            onClick={() => setLocation('/upload')}
            className="bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)] mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Dataset
          </Button>
        </div>

        {datasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No datasets yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first CSV or Excel file to get started with interactive dashboards
              </p>
              <Button
                onClick={() => setLocation('/upload')}
                className="bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Dataset
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset: any) => (
              <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-5 h-5 text-[hsl(221,83%,53%)] mr-2" />
                      <CardTitle className="text-lg truncate">{dataset.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Database className="w-4 h-4 mr-2" />
                      <span>{dataset.rowCount.toLocaleString()} rows</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(dataset.uploadedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {dataset.filename}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(dataset.fileSize)}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/dataset/${dataset.id}`)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setLocation(`/dashboard/${dataset.id}`)}
                        className="flex-1 bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Dashboard
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(dataset.id, dataset.name)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}