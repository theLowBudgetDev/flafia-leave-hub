
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Mail, Lock, UserCog, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("staff");

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate staff login
    navigate("/dashboard");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate admin login
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-xl">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
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
                          required
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
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded border-border" />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full">
                      Sign In as Staff
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
                          required
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
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded border-border" />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full">
                      Sign In as Admin
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
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
