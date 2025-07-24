import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would make an API call to send a password reset email
    setIsSubmitted(true);
    toast({
      title: "Reset Email Sent",
      description: "If your email exists in our system, you will receive password reset instructions.",
    });
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive password reset instructions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Check your email for reset instructions" 
                : "We'll send you instructions to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@fulafia.edu.ng"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Send Reset Instructions
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">
                  If your email exists in our system, you will receive password reset instructions shortly.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Don't see the email? Check your spam folder or try again.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/signin" className="flex items-center justify-center text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;