
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import History from "./pages/History";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import RequestManagement from "./pages/admin/RequestManagement";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="fulafia-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Staff Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="staff">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/apply" element={
                <ProtectedRoute requiredRole="staff">
                  <ApplyLeave />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute requiredRole="staff">
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute requiredRole="staff">
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/staff" element={
                <ProtectedRoute requiredRole="admin">
                  <StaffManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/requests" element={
                <ProtectedRoute requiredRole="admin">
                  <RequestManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/calendar" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCalendar />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
