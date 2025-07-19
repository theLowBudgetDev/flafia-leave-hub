import { Button } from "@/components/ui/button";
import { GraduationCap, User, Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FULafia</h1>
              <p className="text-sm text-muted-foreground">Leave Management System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#apply" className="text-foreground hover:text-primary transition-colors">
              Apply Leave
            </a>
            <a href="#history" className="text-foreground hover:text-primary transition-colors">
              My Requests
            </a>
            <a href="#calendar" className="text-foreground hover:text-primary transition-colors">
              Calendar
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};