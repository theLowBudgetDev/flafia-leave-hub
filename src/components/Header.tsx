
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  // Determine if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="FULafia Logo" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">FULafia</h1>
              <p className="text-sm text-muted-foreground">Leave Management System</p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Hidden on tablet and mobile */}
          <nav className="hidden lg:flex items-center gap-6">
            {isAuthenticated && isAdmin ? (
              // Admin Navigation
              <>
                <Link to="/admin" className={`text-foreground hover:text-primary transition-colors ${isAdminRoute && location.pathname === "/admin" ? "text-primary font-medium" : ""}`}>
                  Dashboard
                </Link>
                <Link to="/admin/requests" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/admin/requests" ? "text-primary font-medium" : ""}`}>
                  Requests
                </Link>
                <Link to="/admin/staff" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/admin/staff" ? "text-primary font-medium" : ""}`}>
                  Staff
                </Link>
                <Link to="/admin/calendar" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/admin/calendar" ? "text-primary font-medium" : ""}`}>
                  Calendar
                </Link>
                <Link to="/admin/reports" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/admin/reports" ? "text-primary font-medium" : ""}`}>
                  Reports
                </Link>
              </>
            ) : isAuthenticated ? (
              // Staff Navigation
              <>
                <Link to="/dashboard" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/dashboard" ? "text-primary font-medium" : ""}`}>
                  Dashboard
                </Link>
                <Link to="/apply" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/apply" ? "text-primary font-medium" : ""}`}>
                  Apply Leave
                </Link>
                <Link to="/history" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/history" ? "text-primary font-medium" : ""}`}>
                  My Requests
                </Link>
                <Link to="/calendar" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/calendar" ? "text-primary font-medium" : ""}`}>
                  Calendar
                </Link>
              </>
            ) : (
              // Public Navigation
              <>
                <Link to="/about" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/about" ? "text-primary font-medium" : ""}`}>
                  About
                </Link>
                <Link to="/contact" className={`text-foreground hover:text-primary transition-colors ${location.pathname === "/contact" ? "text-primary font-medium" : ""}`}>
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <ProfileDropdown />
              </>
            ) : (
              <Link to="/signin">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile/Tablet Controls */}
          <div className="flex lg:hidden items-center gap-3">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};
