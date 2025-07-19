
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { Separator } from "@/components/ui/separator";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  
  // Mock authentication state - in real app this would come from auth context
  const isAuthenticated = false;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/apply", label: "Apply Leave" },
    { href: "/history", label: "My Requests" },
    { href: "/calendar", label: "Calendar" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">FULafia</h2>
              <p className="text-sm text-muted-foreground">Leave Management</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-accent text-left"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated && (
            <>
              <Separator className="mb-6" />
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Notifications</span>
                  <NotificationDropdown />
                </div>
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Profile</span>
                  <ProfileDropdown />
                </div>
              </div>
            </>
          )}

          <div className="mt-auto">
            {!isAuthenticated && (
              <Button className="w-full" asChild>
                <Link to="/signin" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
