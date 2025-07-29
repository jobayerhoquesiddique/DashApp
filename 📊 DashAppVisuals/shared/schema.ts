import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerInitials: text("customer_initials").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // "completed", "pending", "failed"
  date: timestamp("date").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  change: decimal("change", { precision: 5, scale: 2 }).notNull(),
  trend: text("trend").notNull(), // "up", "down"
  date: timestamp("date").notNull(),
});

export const chartData = pgTable("chart_data", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "revenue", "category", "customer"
  label: text("label").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "success", "info", "warning", "error"
  timestamp: timestamp("timestamp").notNull(),
});

// New schema for uploaded datasets
export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
  columns: json("columns").notNull(), // Array of column definitions
  rowCount: integer("row_count").notNull(),
  fileSize: integer("file_size").notNull(),
});

// Table for storing actual data rows from uploaded files
export const dataRows = pgTable("data_rows", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  rowIndex: integer("row_index").notNull(),
  data: json("data").notNull(), // JSON object containing all column values
  createdAt: timestamp("created_at").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
});

export const insertChartDataSchema = createInsertSchema(chartData).omit({
  id: true,
});

export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
});

export const insertDataRowSchema = createInsertSchema(dataRows).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type ChartData = typeof chartData.$inferSelect;
export type InsertChartData = z.infer<typeof insertChartDataSchema>;
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type DataRow = typeof dataRows.$inferSelect;
export type InsertDataRow = z.infer<typeof insertDataRowSchema>;
