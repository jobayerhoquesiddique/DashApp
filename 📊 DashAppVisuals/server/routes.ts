import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to detect column types
function detectColumnType(values: any[]): string {
  const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonEmptyValues.length === 0) return 'text';
  
  // Check if all values are numbers
  const numericValues = nonEmptyValues.filter(v => !isNaN(parseFloat(v)) && isFinite(parseFloat(v)));
  if (numericValues.length === nonEmptyValues.length) return 'number';
  
  // Check if all values are dates
  const dateValues = nonEmptyValues.filter(v => !isNaN(Date.parse(v)));
  if (dateValues.length === nonEmptyValues.length) return 'date';
  
  return 'text';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics endpoint
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Transactions endpoint with filtering and pagination
  app.get("/api/transactions", async (req, res) => {
    try {
      const { category, region, search, page = "1", limit = "10" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const filters = {
        category: category as string,
        region: region as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset
      };

      const [transactions, total] = await Promise.all([
        storage.getTransactions(filters),
        storage.getTransactionCount(filters)
      ]);

      res.json({
        transactions,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Chart data endpoints
  app.get("/api/chart-data/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const data = await storage.getChartData(type);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Top regions endpoint
  app.get("/api/top-regions", async (req, res) => {
    try {
      const regions = await storage.getTopRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top regions" });
    }
  });

  // Recent activities endpoint  
  app.get("/api/activities", async (req, res) => {
    try {
      const { limit } = req.query;
      const activities = await storage.getRecentActivities(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Dataset management endpoints
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch datasets" });
    }
  });

  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dataset = await storage.getDataset(id);
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dataset" });
    }
  });

  app.delete("/api/datasets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDataset(id);
      if (!success) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      await storage.createActivity({
        message: `Dataset deleted`,
        type: "info",
        timestamp: new Date()
      });
      
      res.json({ message: "Dataset deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dataset" });
    }
  });

  // Get data rows from a dataset
  app.get("/api/datasets/:id/data", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { page = "1", limit = "50" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const [rows, total] = await Promise.all([
        storage.getDataRows(id, parseInt(limit as string), offset),
        storage.getDataRowCount(id)
      ]);

      res.json({
        rows,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data rows" });
    }
  });

  // Generate dashboard data from dataset
  app.get("/api/datasets/:id/dashboard", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [metrics, charts] = await Promise.all([
        storage.generateMetricsFromDataset(id),
        storage.generateChartsFromDataset(id)
      ]);

      res.json({ metrics, charts });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate dashboard data" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "Dataset name is required" });
      }

      let data: any[][] = [];
      
      // Parse file based on type
      if (file.mimetype === 'text/csv' || file.originalname?.endsWith('.csv')) {
        const csvText = file.buffer.toString('utf-8');
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        data = parsed.data as any[][];
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.originalname?.endsWith('.xlsx') || file.originalname?.endsWith('.xls')) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload CSV or Excel files." });
      }

      if (data.length === 0) {
        return res.status(400).json({ error: "File appears to be empty" });
      }

      // Extract headers and detect column types
      const headers = data[0] as string[];
      const rows = data.slice(1);
      
      if (headers.length === 0) {
        return res.status(400).json({ error: "No columns found in file" });
      }

      // Detect column types
      const columns = headers.map((header, index) => {
        const columnValues = rows.map(row => row[index]).slice(0, 100); // Sample first 100 rows
        return {
          name: header || `Column ${index + 1}`,
          type: detectColumnType(columnValues),
          index
        };
      });

      // Create dataset
      const dataset = await storage.createDataset({
        name,
        filename: file.originalname || 'unknown',
        uploadedAt: new Date(),
        columns: columns as any,
        rowCount: rows.length,
        fileSize: file.buffer.length
      });

      // Store data rows
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData: any = {};
        
        headers.forEach((header, colIndex) => {
          const columnName = header || `Column ${colIndex + 1}`;
          rowData[columnName] = row[colIndex] || null;
        });

        await storage.createDataRow({
          datasetId: dataset.id,
          rowIndex: i,
          data: rowData,
          createdAt: new Date()
        });
      }

      await storage.createActivity({
        message: `Dataset "${name}" uploaded with ${rows.length} rows`,
        type: "success",
        timestamp: new Date()
      });

      res.json({ 
        message: "File uploaded successfully", 
        dataset,
        rowsProcessed: rows.length 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process uploaded file" });
    }
  });

  // Data refresh endpoint
  app.post("/api/refresh", async (req, res) => {
    try {
      res.json({ message: "Data refreshed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
