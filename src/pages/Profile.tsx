import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Clock, 
  Settings as SettingsIcon,
  FileText,
  Download
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Mock user data
  const userData = {
    name: user?.name || "Dr. Sarah Johnson",
    email: user?.email || "sarah.johnson@fulafia.edu.ng",
    department: user?.department || "Computer Science",
    position: "Senior Lecturer",
    phone: "+234 803 123 4567",
    joinDate: "January 15, 2020",
    leaveBalance: {
      total: 25,
      used: 8,
      pending: 2,
      remaining: 15
    },
    recentLeave: [
      {
        type: "Annual Leave",
        dates: "Dec 23 - Dec 30, 2024",
        status: "Approved"
      },
      {
        type: "Sick Leave",
        dates: "Nov 15, 2024",
        status: "Pending"
      }
    ]
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'rejected':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground">{userData.name}</h2>
                <p className="text-muted-foreground mb-2">{userData.position}</p>
                <Badge variant="outline" className="mb-4">{userData.department}</Badge>
                
                <Link to="/settings">
                  <Button variant="outline" className="w-full">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{userData.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{userData.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{userData.joinDate}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Leave Balance</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{userData.leaveBalance.total}</p>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{userData.leaveBalance.used}</p>
                  <p className="text-sm text-muted-foreground">Used Days</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{userData.leaveBalance.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Days</p>
                </div>
                
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{userData.leaveBalance.remaining}</p>
                  <p className="text-sm text-muted-foreground">Remaining Days</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Downloading...
                    </span>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </>
                  )}
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Leave Requests</h2>
                <Link to="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {userData.recentLeave.length > 0 ? (
                <div className="space-y-4">
                  {userData.recentLeave.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{leave.type}</p>
                          <p className="text-sm text-muted-foreground">{leave.dates}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent leave requests</p>
                </div>
              )}
              
              <div className="mt-6">
                <Link to="/apply">
                  <Button className="w-full">Apply for Leave</Button>
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

export default Profile;