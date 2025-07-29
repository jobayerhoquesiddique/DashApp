import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import DatasetsPage from "@/pages/datasets";
import UploadPage from "@/pages/upload";
import DatasetDetailPage from "@/pages/dataset-detail";
import DatasetDashboardPage from "@/pages/dataset-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={DatasetsPage} />
          <Route path="/datasets" component={DatasetsPage} />
          <Route path="/upload" component={UploadPage} />
          <Route path="/dataset/:id" component={DatasetDetailPage} />
          <Route path="/dashboard/:id" component={DatasetDashboardPage} />
          <Route path="/demo" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
