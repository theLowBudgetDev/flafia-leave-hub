
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      icon: Calendar,
      label: "Total Leave Days",
      value: "25",
      subtitle: "Annual Allocation"
    },
    {
      icon: CheckCircle,
      label: "Used Leave Days",
      value: "8",
      subtitle: "This Year"
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: "2",
      subtitle: "Awaiting Approval"
    },
    {
      icon: AlertCircle,
      label: "Remaining Days",
      value: "17",
      subtitle: "Available"
    }
  ];

  const recentRequests = [
    {
      id: 1,
      type: "Annual Leave",
      dates: "Dec 23 - Dec 30, 2024",
      status: "Approved",
      days: 7
    },
    {
      id: 2,
      type: "Sick Leave",
      dates: "Nov 15, 2024",
      status: "Pending",
      days: 1
    },
    {
      id: 3,
      type: "Personal Leave",
      dates: "Oct 20 - Oct 21, 2024",
      status: "Approved",
      days: 2
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your leave overview.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{request.type}</p>
                      <p className="text-sm text-muted-foreground">{request.dates}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">{request.days} day{request.days > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
