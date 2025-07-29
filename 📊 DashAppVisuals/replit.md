# DashApp - Interactive Dashboard

## Overview

DashApp is a modern, full-stack web application that converts spreadsheet data into interactive dashboards for data visualization and analytics. The application features a clean, professional interface built with React and TypeScript on the frontend, with an Express.js API backend. Users can upload CSV/Excel files and automatically generate comprehensive dashboards with charts, metrics, and interactive data tables.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **ORM**: Drizzle ORM with Zod schema validation
- **Connection**: Neon Database serverless driver
- **Migration**: Drizzle Kit for schema management

## Key Components

### Dashboard Features
1. **KPI Cards**: Display key metrics with trend indicators
2. **Interactive Charts**: Line charts, bar charts, and donut charts for data visualization
3. **Data Table**: Paginated transactions table with filtering and sorting
4. **Filter System**: Category, region, and search-based filtering
5. **Activity Feed**: Real-time activity updates
6. **Regional Analysis**: Top-performing regions display

### UI Component System
- Comprehensive component library based on Radix UI
- Consistent design system with neutral color palette
- Responsive design supporting desktop, tablet, and mobile
- Accessibility-first approach with proper ARIA labels
- Dark mode support built into the design system

### API Endpoints
- `/api/metrics` - Dashboard KPI metrics
- `/api/transactions` - Paginated transaction data with filtering
- `/api/chart-data/:type` - Chart data for different visualization types
- `/api/top-regions` - Regional performance data
- `/api/activities` - Recent activity feed

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle requests and business logic
3. **Data Storage**: Currently using in-memory storage with seed data
4. **Response Processing**: JSON responses are cached and managed by React Query
5. **UI Updates**: Components automatically re-render when data changes

The application uses a unidirectional data flow where the frontend makes API calls, the backend processes requests and returns JSON data, and the frontend updates the UI reactively.

## External Dependencies

### Frontend Dependencies
- **@radix-ui/\***: Comprehensive UI primitive components
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: PostgreSQL database driver
- **zod**: Schema validation
- **tsx**: TypeScript execution for development

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type system
- **tailwindcss**: CSS framework
- **postcss**: CSS processing

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **API Integration**: Express server runs alongside Vite
- **Database**: Environment variable configuration for DATABASE_URL
- **Type Checking**: TypeScript compilation without emission

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serves both API and static files
- **Environment**: Production mode with optimized builds

### Database Strategy
- **Schema Management**: Drizzle migrations in `./migrations`
- **Development**: Can use in-memory storage for quick setup
- **Production**: PostgreSQL via Neon Database or other providers
- **Push Strategy**: `npm run db:push` for schema deployment

The application is designed to be easily deployed to platforms like Replit, Vercel, or traditional hosting providers, with environment-based configuration for different deployment scenarios.