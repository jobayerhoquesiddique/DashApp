import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Upload, Home } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/datasets", label: "Datasets", icon: Database },
    { href: "/upload", label: "Upload", icon: Upload },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-[hsl(221,83%,53%)] mr-2" />
              <h1 className="text-2xl font-bold text-[hsl(221,83%,53%)]">DashApp</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                             (item.href === "/datasets" && location.startsWith("/dataset"));
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={isActive ? "bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]" : ""}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}