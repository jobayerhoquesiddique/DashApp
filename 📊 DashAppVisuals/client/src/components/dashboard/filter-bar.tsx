import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { DashboardFilters } from "@/types/dashboard";

interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: Partial<DashboardFilters>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onResetFilters 
}: FilterBarProps) {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search data..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select 
          value={filters.category} 
          onValueChange={(value) => onFiltersChange({ category: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.region} 
          onValueChange={(value) => onFiltersChange({ region: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="north">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia Pacific</SelectItem>
            <SelectItem value="latam">Latin America</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button onClick={onApplyFilters} className="bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
            Apply
          </Button>
          <Button variant="outline" onClick={onResetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
