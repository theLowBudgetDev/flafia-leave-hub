import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/images/logo.png" 
                alt="FULafia Logo" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">FULafia Leave Management</h3>
                <p className="text-sm text-muted-foreground">Federal University, Lafia</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Streamlining leave management processes for all university staff through 
              modern digital solutions and efficient workflow management.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/apply" className="text-muted-foreground hover:text-primary transition-colors">Apply Leave</Link></li>
              <li><Link to="/history" className="text-muted-foreground hover:text-primary transition-colors">Request History</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">Lafia, Nasarawa State</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">+234 803 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">hr@fulafia.edu.ng</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Federal University, Lafia. All rights reserved. | 
            <span className="text-primary"> Leave Management System</span>
          </p>
        </div>
      </div>
    </footer>
  );
};