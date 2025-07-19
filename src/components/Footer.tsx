import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
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
              <li><a href="#dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#apply" className="text-muted-foreground hover:text-primary transition-colors">Apply Leave</a></li>
              <li><a href="#history" className="text-muted-foreground hover:text-primary transition-colors">Request History</a></li>
              <li><a href="#help" className="text-muted-foreground hover:text-primary transition-colors">Help & Support</a></li>
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
                <span className="text-muted-foreground text-sm">+234 xxx xxx xxxx</span>
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
            © 2024 Federal University, Lafia. All rights reserved. | 
            <span className="text-primary"> Leave Management System</span>
          </p>
        </div>
      </div>
    </footer>
  );
};