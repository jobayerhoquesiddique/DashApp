import { users, transactions, metrics, chartData, regions, activities, datasets, dataRows, type User, type InsertUser, type Transaction, type InsertTransaction, type Metric, type InsertMetric, type ChartData, type InsertChartData, type Region, type InsertRegion, type Activity, type InsertActivity, type Dataset, type InsertDataset, type DataRow, type InsertDataRow } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transactions
  getTransactions(filters?: { category?: string; region?: string; search?: string; limit?: number; offset?: number }): Promise<Transaction[]>;
  getTransactionCount(filters?: { category?: string; region?: string; search?: string }): Promise<number>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Metrics
  getMetrics(): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  // Chart Data
  getChartData(type: string): Promise<ChartData[]>;
  createChartData(data: InsertChartData): Promise<ChartData>;
  
  // Regions
  getTopRegions(): Promise<Region[]>;
  createRegion(region: InsertRegion): Promise<Region>;
  
  // Activities
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Datasets
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  deleteDataset(id: number): Promise<boolean>;
  
  // Data Rows
  getDataRows(datasetId: number, limit?: number, offset?: number): Promise<DataRow[]>;
  getDataRowCount(datasetId: number): Promise<number>;
  createDataRow(dataRow: InsertDataRow): Promise<DataRow>;
  deleteDataRows(datasetId: number): Promise<boolean>;
  
  // Dynamic dashboard data generation
  generateMetricsFromDataset(datasetId: number): Promise<Metric[]>;
  generateChartsFromDataset(datasetId: number): Promise<{ revenue: ChartData[], category: ChartData[], distribution: ChartData[] }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private metrics: Map<number, Metric>;
  private chartData: Map<number, ChartData>;
  private regions: Map<number, Region>;
  private activities: Map<number, Activity>;
  private datasets: Map<number, Dataset>;
  private dataRows: Map<number, DataRow>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.metrics = new Map();
    this.chartData = new Map();
    this.regions = new Map();
    this.activities = new Map();
    this.datasets = new Map();
    this.dataRows = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed sample data
    const sampleTransactions: InsertTransaction[] = [
      {
        orderId: "#12847",
        customerName: "Jane Doe",
        customerInitials: "JD",
        amount: "297.45",
        status: "completed",
        date: new Date("2023-12-15"),
        category: "electronics",
        region: "north"
      },
      {
        orderId: "#12846", 
        customerName: "Mike Smith",
        customerInitials: "MS",
        amount: "145.20",
        status: "pending",
        date: new Date("2023-12-15"),
        category: "clothing",
        region: "europe"
      },
      {
        orderId: "#12845",
        customerName: "Anna Brown", 
        customerInitials: "AB",
        amount: "524.80",
        status: "completed",
        date: new Date("2023-12-14"),
        category: "home",
        region: "asia"
      },
      {
        orderId: "#12844",
        customerName: "Chris Johnson",
        customerInitials: "CJ", 
        amount: "89.95",
        status: "failed",
        date: new Date("2023-12-14"),
        category: "books",
        region: "latam"
      }
    ];

    const sampleMetrics: InsertMetric[] = [
      {
        name: "Total Revenue",
        value: "$847,392",
        change: "12.5",
        trend: "up",
        date: new Date()
      },
      {
        name: "New Customers", 
        value: "2,847",
        change: "8.3",
        trend: "up",
        date: new Date()
      },
      {
        name: "Conversion Rate",
        value: "3.24%",
        change: "-2.1", 
        trend: "down",
        date: new Date()
      },
      {
        name: "Avg Order Value",
        value: "$297.45",
        change: "5.7",
        trend: "up",
        date: new Date()
      }
    ];

    const sampleRegions: InsertRegion[] = [
      { code: "US", name: "United States", revenue: "247000" },
      { code: "CA", name: "Canada", revenue: "89000" },
      { code: "UK", name: "United Kingdom", revenue: "67000" },
      { code: "DE", name: "Germany", revenue: "45000" }
    ];

    const sampleActivities: InsertActivity[] = [
      {
        message: "New order #12847 received",
        type: "success",
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        message: "Customer Jane D. registered", 
        type: "info",
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        message: "Inventory alert for Electronics",
        type: "warning",
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        message: "Marketing campaign launched",
        type: "info", 
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    // Revenue chart data
    const revenueData: InsertChartData[] = [
      { type: "revenue", label: "Mon", value: "12000", date: new Date() },
      { type: "revenue", label: "Tue", value: "19000", date: new Date() },
      { type: "revenue", label: "Wed", value: "15000", date: new Date() },
      { type: "revenue", label: "Thu", value: "25000", date: new Date() },
      { type: "revenue", label: "Fri", value: "22000", date: new Date() },
      { type: "revenue", label: "Sat", value: "30000", date: new Date() },
      { type: "revenue", label: "Sun", value: "28000", date: new Date() }
    ];

    // Category chart data
    const categoryData: InsertChartData[] = [
      { type: "category", label: "Electronics", value: "85000", date: new Date() },
      { type: "category", label: "Clothing", value: "65000", date: new Date() },
      { type: "category", label: "Books", value: "45000", date: new Date() },
      { type: "category", label: "Home", value: "55000", date: new Date() },
      { type: "category", label: "Sports", value: "35000", date: new Date() }
    ];

    // Customer distribution data
    const customerData: InsertChartData[] = [
      { type: "customer", label: "New Customers", value: "45", date: new Date() },
      { type: "customer", label: "Returning", value: "35", date: new Date() },
      { type: "customer", label: "VIP", value: "20", date: new Date() }
    ];

    // Seed all data
    sampleTransactions.forEach(t => this.createTransaction(t));
    sampleMetrics.forEach(m => this.createMetric(m)); 
    sampleRegions.forEach(r => this.createRegion(r));
    sampleActivities.forEach(a => this.createActivity(a));
    [...revenueData, ...categoryData, ...customerData].forEach(d => this.createChartData(d));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTransactions(filters?: { category?: string; region?: string; search?: string; limit?: number; offset?: number }): Promise<Transaction[]> {
    let transactions = Array.from(this.transactions.values());
    
    if (filters?.category && filters.category !== 'all') {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    if (filters?.region && filters.region !== 'all') {
      transactions = transactions.filter(t => t.region === filters.region);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      transactions = transactions.filter(t => 
        t.customerName.toLowerCase().includes(search) ||
        t.orderId.toLowerCase().includes(search)
      );
    }
    
    // Sort by date desc
    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 10;
    
    return transactions.slice(offset, offset + limit);
  }

  async getTransactionCount(filters?: { category?: string; region?: string; search?: string }): Promise<number> {
    let transactions = Array.from(this.transactions.values());
    
    if (filters?.category && filters.category !== 'all') {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    if (filters?.region && filters.region !== 'all') {
      transactions = transactions.filter(t => t.region === filters.region);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      transactions = transactions.filter(t => 
        t.customerName.toLowerCase().includes(search) ||
        t.orderId.toLowerCase().includes(search)
      );
    }
    
    return transactions.length;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.currentId++;
    const metric: Metric = { ...insertMetric, id };
    this.metrics.set(id, metric);
    return metric;
  }

  async getChartData(type: string): Promise<ChartData[]> {
    return Array.from(this.chartData.values()).filter(d => d.type === type);
  }

  async createChartData(insertChartData: InsertChartData): Promise<ChartData> {
    const id = this.currentId++;
    const data: ChartData = { ...insertChartData, id };
    this.chartData.set(id, data);
    return data;
  }

  async getTopRegions(): Promise<Region[]> {
    return Array.from(this.regions.values())
      .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const id = this.currentId++;
    const region: Region = { ...insertRegion, id };
    this.regions.set(id, region);
    return region;
  }

  async getRecentActivities(limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Dataset methods
  async getDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values())
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.currentId++;
    const dataset: Dataset = { ...insertDataset, id };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async deleteDataset(id: number): Promise<boolean> {
    // Delete all data rows for this dataset
    await this.deleteDataRows(id);
    // Delete the dataset itself
    return this.datasets.delete(id);
  }

  // Data row methods
  async getDataRows(datasetId: number, limit = 100, offset = 0): Promise<DataRow[]> {
    const rows = Array.from(this.dataRows.values())
      .filter(row => row.datasetId === datasetId)
      .sort((a, b) => a.rowIndex - b.rowIndex);
    
    return rows.slice(offset, offset + limit);
  }

  async getDataRowCount(datasetId: number): Promise<number> {
    return Array.from(this.dataRows.values())
      .filter(row => row.datasetId === datasetId).length;
  }

  async createDataRow(insertDataRow: InsertDataRow): Promise<DataRow> {
    const id = this.currentId++;
    const dataRow: DataRow = { ...insertDataRow, id };
    this.dataRows.set(id, dataRow);
    return dataRow;
  }

  async deleteDataRows(datasetId: number): Promise<boolean> {
    const rowsToDelete = Array.from(this.dataRows.entries())
      .filter(([_, row]) => row.datasetId === datasetId);
    
    rowsToDelete.forEach(([id]) => this.dataRows.delete(id));
    return true;
  }

  // Dynamic metrics generation from dataset
  async generateMetricsFromDataset(datasetId: number): Promise<Metric[]> {
    const rows = await this.getDataRows(datasetId);
    if (rows.length === 0) return [];

    const dataset = await this.getDataset(datasetId);
    if (!dataset) return [];

    const columns = dataset.columns as any[];
    const numericColumns = columns.filter(col => col.type === 'number');
    const metrics: Metric[] = [];

    // Generate basic metrics
    numericColumns.forEach(col => {
      const values = rows.map(row => {
        const data = row.data as any;
        return parseFloat(data[col.name]) || 0;
      }).filter(val => !isNaN(val));

      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        metrics.push({
          id: this.currentId++,
          name: `Total ${col.name}`,
          value: sum.toLocaleString(),
          change: '0',
          trend: 'up',
          date: new Date()
        });

        metrics.push({
          id: this.currentId++,
          name: `Avg ${col.name}`,
          value: avg.toFixed(2),
          change: '0',
          trend: 'up',
          date: new Date()
        });
      }
    });

    // Row count metric
    metrics.push({
      id: this.currentId++,
      name: 'Total Records',
      value: rows.length.toLocaleString(),
      change: '0',
      trend: 'up',
      date: new Date()
    });

    return metrics;
  }

  // Dynamic chart generation from dataset
  async generateChartsFromDataset(datasetId: number): Promise<{ revenue: ChartData[], category: ChartData[], distribution: ChartData[] }> {
    const rows = await this.getDataRows(datasetId);
    if (rows.length === 0) return { revenue: [], category: [], distribution: [] };

    const dataset = await this.getDataset(datasetId);
    if (!dataset) return { revenue: [], category: [], distribution: [] };

    const columns = dataset.columns as any[];
    const numericColumns = columns.filter(col => col.type === 'number');
    const textColumns = columns.filter(col => col.type === 'text');

    const result: { revenue: ChartData[], category: ChartData[], distribution: ChartData[] } = { revenue: [], category: [], distribution: [] };

    // Generate revenue-like chart (time series if date column exists)
    const dateColumn = columns.find(col => col.type === 'date');
    const primaryNumeric = numericColumns[0];

    if (dateColumn && primaryNumeric) {
      const groupedData = new Map();
      rows.forEach(row => {
        const data = row.data as any;
        const date = new Date(data[dateColumn.name]);
        const value = parseFloat(data[primaryNumeric.name]) || 0;
        const key = date.toLocaleDateString();
        
        groupedData.set(key, (groupedData.get(key) || 0) + value);
      });

      Array.from(groupedData.entries()).forEach(([label, value]) => {
        result.revenue.push({
          id: this.currentId++,
          type: 'revenue',
          label,
          value: value.toString(),
          date: new Date()
        });
      });
    }

    // Generate category chart from text columns
    if (textColumns.length > 0 && numericColumns.length > 0) {
      const categoryColumn = textColumns[0];
      const valueColumn = numericColumns[0];
      const groupedData = new Map();

      rows.forEach(row => {
        const data = row.data as any;
        const category = data[categoryColumn.name] || 'Unknown';
        const value = parseFloat(data[valueColumn.name]) || 0;
        
        groupedData.set(category, (groupedData.get(category) || 0) + value);
      });

      Array.from(groupedData.entries()).slice(0, 5).forEach(([label, value]) => {
        result.category.push({
          id: this.currentId++,
          type: 'category',
          label,
          value: value.toString(),
          date: new Date()
        });
      });
    }

    // Generate distribution chart
    if (textColumns.length > 0) {
      const column = textColumns[0];
      const counts = new Map();

      rows.forEach(row => {
        const data = row.data as any;
        const value = data[column.name] || 'Unknown';
        counts.set(value, (counts.get(value) || 0) + 1);
      });

      const total = rows.length;
      Array.from(counts.entries()).slice(0, 3).forEach(([label, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        result.distribution.push({
          id: this.currentId++,
          type: 'distribution',
          label,
          value: percentage,
          date: new Date()
        });
      });
    }

    return result;
  }
}

export const storage = new MemStorage();
