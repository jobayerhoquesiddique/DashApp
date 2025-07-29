export interface DashboardFilters {
  category: string;
  region: string;
  search: string;
  dateRange: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

export interface TransactionResponse {
  transactions: any[];
  total: number;
  page: number;
  totalPages: number;
}
