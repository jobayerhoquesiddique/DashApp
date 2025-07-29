import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Download, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { DashboardFilters } from "@/types/dashboard";
import { formatCurrency, formatDate } from "@/lib/mock-data";

interface TransactionsTableProps {
  filters: DashboardFilters;
}

export function TransactionsTable({ filters }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("");
  const pageSize = 10;

  const { data, isLoading } = useQuery<any>({
    queryKey: ['/api/transactions', {
      category: filters.category,
      region: filters.region,
      search: filters.search,
      page: currentPage,
      limit: pageSize
    }]
  });

  const handleSort = (field: string) => {
    setSortField(field === sortField ? "" : field);
  };

  const handleExport = () => {
    // In a real app, this would download the data
    console.log("Exporting data...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,45%)]/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-[hsl(43,96%,56%)]/10 text-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,56%)]/20">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-[hsl(221,83%,53%)]/10 text-[hsl(221,83%,53%)]',
      'bg-[hsl(188,95%,30%)]/10 text-[hsl(188,95%,30%)]',
      'bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)]',
      'bg-[hsl(43,96%,56%)]/10 text-[hsl(43,96%,56%)]'
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { transactions = [], total = 0, totalPages = 0 } = data || {};
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Recent Transactions</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('orderId')}
                    className="hover:text-[hsl(221,83%,53%)]"
                  >
                    Order ID
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('amount')}
                    className="hover:text-[hsl(221,83%,53%)]"
                  >
                    Amount
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('date')}
                    className="hover:text-[hsl(221,83%,53%)]"
                  >
                    Date
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="font-mono text-sm text-[hsl(221,83%,53%)]">
                      {transaction.orderId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getInitialsColor(transaction.customerInitials)}`}>
                        <span className="text-sm font-medium">{transaction.customerInitials}</span>
                      </div>
                      <span className="text-gray-900">{transaction.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-[hsl(221,83%,53%)]"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
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
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
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
      </CardContent>
    </Card>
  );
}
