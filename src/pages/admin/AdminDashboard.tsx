import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Staff",
      value: "324",
      subtitle: "Active employees",
      trend: "+5 this month"
    },
    {
      icon: FileText,
      label: "Pending Requests",
      value: "18",
      subtitle: "Awaiting approval",
      trend: "3 urgent"
    },
    {
      icon: CheckCircle,
      label: "Approved Today",
      value: "12",
      subtitle: "Leave requests",
      trend: "+2 from yesterday"
    },
    {
      icon: Calendar,
      label: "Leave Coverage",
      value: "85%",
      subtitle: "Staff availability",
      trend: "Normal range"
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      staff: "Dr. Sarah Johnson",
      department: "Computer Science",
      type: "Annual Leave",
      dates: "Jan 15 - Jan 22, 2025",
      days: 6,
      priority: "Normal"
    },
    {
      id: 2,
      staff: "Prof. Michael Adams",
      department: "Mathematics",
      type: "Sick Leave",
      dates: "Jan 12 - Jan 14, 2025",
      days: 3,
      priority: "Urgent"
    },
    {
      id: 3,
      staff: "Dr. Fatima Ali",
      department: "Physics",
      type: "Conference",
      dates: "Jan 20 - Jan 25, 2025",
      days: 4,
      priority: "Normal"
    },
    {
      id: 4,
      staff: "Dr. James Wilson",
      department: "Chemistry",
      type: "Personal Leave",
      dates: "Jan 18, 2025",
      days: 1,
      priority: "Normal"
    }
  ];

  const recentActivity = [
    { action: "Approved leave request", staff: "Dr. Mary Brown", time: "2 hours ago" },
    { action: "Rejected leave request", staff: "Prof. David Lee", time: "4 hours ago" },
    { action: "New leave request", staff: "Dr. Lisa Chen", time: "6 hours ago" },
    { action: "Modified leave policy", staff: "System Admin", time: "1 day ago" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'text-destructive bg-destructive/10';
      case 'high':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage leave requests and oversee staff operations.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  <p className="text-xs text-primary mt-1">{stat.trend}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Requests */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Pending Leave Requests</h2>
                <Link to="/admin/requests">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{request.staff}</h3>
                        <p className="text-sm text-muted-foreground">{request.department}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.type}</p>
                        <p className="text-xs text-muted-foreground">{request.dates}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.days} day{request.days > 1 ? 's' : ''}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/admin/requests">
                  <Button className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Requests
                  </Button>
                </Link>
                <Link to="/admin/staff">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Staff Management
                  </Button>
                </Link>
                <Link to="/admin/calendar">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Leave Calendar
                  </Button>
                </Link>
                <Link to="/admin/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Reports & Analytics
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.staff}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;