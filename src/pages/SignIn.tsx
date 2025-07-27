
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, UserCog, Users, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("staff");
  const [isLoading, setIsLoading] = useState(false);
  
  // Staff login form state
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [rememberStaff, setRememberStaff] = useState(false);
  
  // Admin login form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [rememberAdmin, setRememberAdmin] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(staffEmail, staffPassword, "staff");
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to FULafia Leave Management System.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(adminEmail, adminPassword, "admin");
      
      if (success) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/logo.png" 
                alt="FULafia Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your FULafia Leave Management account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Choose your login type and enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="staff" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Staff
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="staff">
                  <form onSubmit={handleStaffLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="staff-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="staff-email"
                          type="email"
                          placeholder="staff@fulafia.edu.ng"
                          className="pl-10"
                          value={staffEmail}
                          onChange={(e) => setStaffEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="staff-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="staff-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded border-border" 
                          checked={rememberStaff}
                          onChange={(e) => setRememberStaff(e.target.checked)}
                          disabled={isLoading}
                        />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In as Staff"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@fulafia.edu.ng"
                          className="pl-10"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter admin password"
                          className="pl-10"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded border-border" 
                          checked={rememberAdmin}
                          onChange={(e) => setRememberAdmin(e.target.checked)}
                          disabled={isLoading}
                        />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In as Admin"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Need help signing in?{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default SignIn;
