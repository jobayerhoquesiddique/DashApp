import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, User } from "lucide-react";

interface HeaderProps {
  onDateRangeChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ onDateRangeChange, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[hsl(221,83%,53%)]">DashApp</h1>
          <span className="ml-2 text-gray-500 hidden sm:inline">Sales Overview</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select onValueChange={onDateRangeChange} defaultValue="7d">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">This Quarter</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-gray-500 hover:text-[hsl(221,83%,53%)]"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-[hsl(221,83%,53%)]"
          >
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
