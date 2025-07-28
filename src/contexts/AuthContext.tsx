import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "staff" | "admin";
  department: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "staff" | "admin") => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Authenticate with real database
  const login = async (email: string, password: string, role: "staff" | "admin"): Promise<boolean> => {
    try {
      // For demo purposes, we'll use simple email-based authentication
      // In production, you'd validate against a proper auth system
      
      if (email && password) {
        let loggedInUser;
        
        // Check if it's an admin login with password validation
        if (role === "admin" && email.includes("admin")) {
          // Validate admin password
          try {
            const response = await fetch('http://localhost:4000/api/admin/settings');
            if (response.ok) {
              const settings = await response.json();
              const storedPassword = settings.adminPassword || 'qwertyuiop';
              if (password === storedPassword) {
                loggedInUser = {
                  id: "admin-1",
                  name: "Admin User",
                  email,
                  role: "admin" as const,
                  department: "Human Resources"
                };
              }
            }
          } catch (error) {
            // Fallback to default password if API fails
            if (password === 'qwertyuiop') {
              loggedInUser = {
                id: "admin-1",
                name: "Admin User",
                email,
                role: "admin" as const,
                department: "Human Resources"
              };
            }
          }
        } else if (role === "staff") {
          // First check if staff exists in database by email
          try {
            const response = await fetch(`http://localhost:4000/api/staff`);
            if (response.ok) {
              const allStaff = await response.json();
              const existingStaff = allStaff.find((staff: any) => staff.email === email);
              
              if (existingStaff) {
                loggedInUser = {
                  id: existingStaff.id,
                  name: existingStaff.name,
                  email: existingStaff.email,
                  role: "staff" as const,
                  department: existingStaff.department
                };
              } else {
                // Create unique staff user for new email
                const uniqueId = `staff-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                loggedInUser = {
                  id: uniqueId,
                  name,
                  email,
                  role: "staff" as const,
                  department: "General"
                };
                
                // Create staff record in database via API
                try {
                  const createResponse = await fetch('http://localhost:4000/api/staff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: uniqueId,
                      name,
                      email,
                      department: "General",
                      position: "Staff",
                      totalLeave: 30,
                      phone: "",
                      annualLeave: 0,
                      sickLeave: 0,
                      maternityLeave: 0,
                      paternityLeave: 0,
                      emergencyLeave: 0
                    })
                  });
                  
                  if (!createResponse.ok) {
                    console.warn('Failed to create staff record in database');
                  }
                } catch (error) {
                  console.warn('Error creating staff record:', error);
                }
              }
            }
          } catch (error) {
            console.warn('Error fetching staff data:', error);
            // Fallback to predefined mapping if API fails
            const staffMapping: Record<string, any> = {
              "john.doe@fulafia.edu.ng": { id: "staff-1", name: "John Doe", department: "Computer Science" },
              "jane.smith@fulafia.edu.ng": { id: "staff-2", name: "Jane Smith", department: "Mathematics" },
              "mike.johnson@fulafia.edu.ng": { id: "staff-3", name: "Mike Johnson", department: "Physics" },
              "sarah.wilson@fulafia.edu.ng": { id: "staff-4", name: "Sarah Wilson", department: "Chemistry" },
              "david.brown@fulafia.edu.ng": { id: "staff-5", name: "David Brown", department: "Biology" }
            };
            
            const staffInfo = staffMapping[email];
            if (staffInfo) {
              loggedInUser = {
                ...staffInfo,
                email,
                role: "staff" as const
              };
            } else {
              const uniqueId = `staff-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
              const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              loggedInUser = {
                id: uniqueId,
                name,
                email,
                role: "staff" as const,
                department: "General"
              };
            }
          }
        }
        
        if (loggedInUser) {
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};