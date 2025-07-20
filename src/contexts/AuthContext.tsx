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
  const [user, setUser] = useState<User | null>(null);

  // In a real app, this would make an API call to authenticate
  const login = async (email: string, password: string, role: "staff" | "admin"): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple validation for demo purposes
      if (email && password) {
        if (role === "admin" && email.includes("admin")) {
          setUser({
            id: "admin-1",
            name: "Admin User",
            email,
            role: "admin",
            department: "Human Resources"
          });
        } else {
          setUser({
            id: "staff-1",
            name: "Staff User",
            email,
            role: "staff",
            department: "Computer Science"
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
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