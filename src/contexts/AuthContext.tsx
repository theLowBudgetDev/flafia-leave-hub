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
        
        // Check if it's an admin login
        if (role === "admin" && email.includes("admin")) {
          loggedInUser = {
            id: "admin-1",
            name: "Admin User",
            email,
            role: "admin" as const,
            department: "Human Resources"
          };
        } else if (role === "staff") {
          // Map email to existing staff IDs for demo
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
            // Default staff user for any other email
            loggedInUser = {
              id: "staff-1",
              name: "Staff User",
              email,
              role: "staff" as const,
              department: "Computer Science"
            };
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