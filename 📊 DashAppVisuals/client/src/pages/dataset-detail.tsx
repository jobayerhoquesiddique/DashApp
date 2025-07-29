import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { formatDate } from "@/lib/mock-data";

export default function DatasetDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const { data: dataset, isLoading: datasetLoading } = useQuery<any>({
    queryKey: [`/api/datasets/${id}`],
    enabled: !!id
  });

  const { data: dataResponse, isLoading: dataLoading } = useQuery<any>({
    queryKey: [`/api/datasets/${id}/data`, currentPage],
    enabled: !!id
  });

  if (datasetLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dataset not found</h1>
          <Button onClick={() => setLocation('/datasets')}>
            Back to Datasets
          </Button>
        </div>
      </div>
    );
  }

  const { rows = [], total = 0, totalPages = 0 } = dataResponse || {};
  const columns = dataset.columns as any[];

  const getColumnTypeBadge = (type: string) => {
    const colors = {
      'number': 'bg-blue-100 text-blue-800',
      'text': 'bg-gray-100 text-gray-800',
      'date': 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || colors.text;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.name}</h1>
            <p className="text-gray-600">
              {dataset.rowCount.toLocaleString()} rows • Uploaded {formatDate(dataset.uploadedAt)}
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button
              onClick={() => setLocation(`/dashboard/${dataset.id}`)}
              className="bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Dataset Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{dataset.rowCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Rows</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{columns.length}</div>
              <div className="text-sm text-gray-600">Columns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{dataset.filename}</div>
              <div className="text-sm text-gray-600">File Name</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">
                {((dataset.fileSize || 0) / 1024).toFixed(1)} KB
              </div>
              <div className="text-sm text-gray-600">File Size</div>
            </CardContent>
          </Card>
        </div>

        {/* Column Schema */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Column Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((column: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{column.name}</span>
                  <Badge className={getColumnTypeBadge(column.type)}>
                    {column.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    {columns.map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column: any, index: number) => (
                          <TableHead key={index} className="whitespace-nowrap">
                            {column.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                          {columns.map((column: any, colIndex: number) => {
                            const value = row.data[column.name];
                            return (
                              <TableCell key={colIndex} className="whitespace-nowrap">
                                {value !== null && value !== undefined ? String(value) : '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} rows
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}