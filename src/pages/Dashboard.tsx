
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { api, LeaveRequest } from "@/services/api";
import { format, parseISO } from "date-fns";

interface StaffStats {
  totalLeave: number;
  usedLeave: number;
  pendingLeave: number;
  remainingLeave: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [staffStats, setStaffStats] = useState<StaffStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          // Fetch staff stats
          const stats = await api.getStaffStats(user.id);
          setStaffStats(stats);
          
          // Fetch leave requests
          const requests = await api.getLeaveRequests(user.id);
          setRecentRequests(requests.slice(0, 3)); // Get only the 3 most recent requests
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'rejected':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (startDate === endDate) {
      return format(start, "MMM d, yyyy");
    }
    
    if (start.getFullYear() === end.getFullYear()) {
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    
    return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
  };

  // Stats cards data
  const statsCards = [
    {
      icon: Calendar,
      label: "Total Leave Days",
      value: staffStats?.totalLeave || 0,
      subtitle: "Annual Allocation"
    },
    {
      icon: CheckCircle,
      label: "Used Leave Days",
      value: staffStats?.usedLeave || 0,
      subtitle: "This Year"
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: staffStats?.pendingLeave || 0,
      subtitle: "Awaiting Approval"
    },
    {
      icon: AlertCircle,
      label: "Remaining Days",
      value: staffStats?.remainingLeave || 0,
      subtitle: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Here's your leave overview.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Recent Leave Requests</h2>
                    <Link to="/history">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View All
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentRequests.length > 0 ? (
                      recentRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium text-foreground">{request.type}</p>
                            <p className="text-sm text-muted-foreground">{formatDateRange(request.startDate, request.endDate)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">{request.days} day{request.days > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No leave requests found</p>
                        <p className="text-sm text-muted-foreground">Submit your first leave request to get started</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
                  <div className="space-y-4">
                    <Link to="/apply">
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Apply for Leave
                      </Button>
                    </Link>
                    <Link to="/calendar">
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Button>
                    </Link>
                    <Link to="/history">
                      <Button variant="outline" className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        Request History
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
