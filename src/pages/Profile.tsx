import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { api, LeaveRequest } from "@/services/api";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Clock, 
  Settings as SettingsIcon,
  FileText,
  Download,
  Loader2
} from "lucide-react";

interface StaffStats {
  totalLeave: number;
  usedLeave: number;
  pendingLeave: number;
  remainingLeave: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentLeave, setRecentLeave] = useState<LeaveRequest[]>([]);
  const [leaveStats, setLeaveStats] = useState<StaffStats | null>(null);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          
          // Fetch recent leave requests
          const requests = await api.getLeaveRequests(user.id);
          setRecentLeave(requests.slice(0, 3)); // Get 3 most recent
          
          // Fetch leave statistics
          const stats = await api.getStaffStats(user.id);
          setLeaveStats(stats);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    if (startDate === endDate) {
      return start.toLocaleDateString('en-US', options);
    }
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Senior Lecturer</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{user?.department || "Department"}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/settings">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button 
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Report
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{user?.email || "email@fulafia.edu.ng"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>+234 803 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Joined January 15, 2020</span>
                </div>
              </div>
            </Card>

            {/* Leave Balance */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
              {leaveStats ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Leave</span>
                    <span className="font-semibold">{leaveStats.totalLeave} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-semibold text-red-600">{leaveStats.usedLeave} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-semibold text-yellow-600">{leaveStats.pendingLeave} days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-semibold text-green-600">{leaveStats.remainingLeave} days</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Leave Usage</span>
                      <span>{Math.round((leaveStats.usedLeave / leaveStats.totalLeave) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(leaveStats.usedLeave / leaveStats.totalLeave) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </Card>
          </div>

          {/* Recent Leave Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Leave Requests</h2>
              <Button variant="outline" asChild>
                <Link to="/history">
                  <FileText className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
            
            {recentLeave.length > 0 ? (
              <div className="space-y-4">
                {recentLeave.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{leave.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateRange(leave.startDate, leave.endDate)} • {leave.days} day{leave.days !== 1 ? 's' : ''}
                      </div>
                      {leave.reason && (
                        <div className="text-sm text-muted-foreground">
                          {leave.reason}
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusColor(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent leave requests</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/apply-leave">Apply for Leave</Link>
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/apply-leave">
                  <FileText className="h-6 w-6" />
                  Apply for Leave
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/history">
                  <Clock className="h-6 w-6" />
                  Leave History
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/calendar">
                  <Calendar className="h-6 w-6" />
                  View Calendar
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;