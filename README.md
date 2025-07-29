# DashApp
Turn you spreadsheet into Dashboard

# DashApp - Interactive Dashboard

DashApp is a modern, full-stack web application that transforms spreadsheet data (CSV/Excel) into interactive dashboards for data visualization and analytics. Built with React, TypeScript, and Express.js, DashApp provides a clean, professional interface for exploring metrics, charts, and tables.

## Features

- **Spreadsheet Upload**: Import CSV/Excel files to generate dashboards.
- **KPI Cards**: Key metrics with trend indicators.
- **Interactive Charts**: Line, bar, and donut charts for data visualization.
- **Data Table**: Paginated, filterable, and sortable transaction tables.
- **Filter System**: Category, region, and search-based filtering.
- **Activity Feed**: Real-time updates.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Dark Mode**: Built-in support.
- **Accessibility**: ARIA labels and keyboard navigation.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI, shadcn/ui, Wouter, React Query
- **Backend**: Express.js, TypeScript, Drizzle ORM, Neon Database (PostgreSQL), Zod
- **Build Tools**: Vite, esbuild
- **Development**: Hot module replacement, in-memory storage for quick setup

## Getting Started

1. **Install dependencies**  
   ```sh
   cd DashAppVisuals
   npm install
   ```

2. **Run development server on port 2000**  
   ```sh
   npm run dev -- --port 2000
   ```
   - Frontend: Vite dev server (`localhost:2000`)
   - Backend/API: Express server (`localhost:2000`)

3. **Build for production**  
   ```sh
   npm run build
   ```

4. **Start production server**  
   ```sh
   npm start
   ```

## API Endpoints

- `/api/metrics` — Dashboard KPI metrics
- `/api/transactions` — Paginated transaction data
- `/api/chart-data/:type` — Chart data for visualizations
- `/api/top-regions` — Regional performance data
- `/api/activities` — Recent activity feed

## Folder Structure

- `client/` — React frontend
- `server/` — Express backend
- `shared/` — Shared types and schema
- `attached_assets/` — Design documentation and assets

https://youtu.be/kyfXETdtkyM
