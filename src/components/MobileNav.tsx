
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, GraduationCap, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/apply", label: "Apply Leave" },
    { href: "/history", label: "My Requests" },
    { href: "/calendar", label: "Calendar" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
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
          
          <nav className="flex flex-col gap-4 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
