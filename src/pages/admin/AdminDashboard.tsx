import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api, LeaveRequest, Staff } from "@/services/api";

interface DashboardStats {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
}

interface Activity {
  action: string;
  staff: string;
  time: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [staffMembers, allRequests] = await Promise.all([
        api.getStaffMembers(),
        api.getLeaveRequests()
      ]);

      // Calculate statistics
      const pendingCount = allRequests.filter(r => r.status === 'Pending').length;
      const approvedToday = allRequests.filter(r => {
        const today = new Date().toISOString().split('T')[0];
        return r.status === 'Approved' && r.approvedDate === today;
      }).length;
      
      const totalStaffOnLeave = allRequests.filter(r => {
        const today = new Date();
        const startDate = new Date(r.startDate);
        const endDate = new Date(r.endDate);
        return r.status === 'Approved' && startDate <= today && endDate >= today;
      }).length;
      
      const staffAvailability = Math.round(((staffMembers.length - totalStaffOnLeave) / staffMembers.length) * 100);

      // Update stats
      setStats([
        {
          icon: Users,
          label: "Total Staff",
          value: staffMembers.length.toString(),
          subtitle: "Active employees",
          trend: "+5 this month"
        },
        {
          icon: FileText,
          label: "Pending Requests",
          value: pendingCount.toString(),
          subtitle: "Awaiting approval",
          trend: pendingCount > 5 ? "High volume" : "Normal"
        },
        {
          icon: CheckCircle,
          label: "Approved Today",
          value: approvedToday.toString(),
          subtitle: "Leave requests",
          trend: approvedToday > 0 ? `+${approvedToday} today` : "No approvals"
        },
        {
          icon: Calendar,
          label: "Staff Availability",
          value: `${staffAvailability}%`,
          subtitle: "Currently available",
          trend: staffAvailability > 80 ? "Good coverage" : "Low coverage"
        }
      ]);

      // Set pending requests
      const pending = allRequests.filter(r => r.status === 'Pending');
      setPendingRequests(pending);

      // Generate recent activity
      const activities: Activity[] = [];
      
      // Add recent approvals/rejections
      const recentDecisions = allRequests
        .filter(r => r.status !== 'Pending' && r.approvedDate)
        .sort((a, b) => new Date(b.approvedDate!).getTime() - new Date(a.approvedDate!).getTime())
        .slice(0, 3);

      recentDecisions.forEach(request => {
        const staff = staffMembers.find(s => s.id === request.staffId);
        if (staff) {
          activities.push({
            action: `${request.status} ${request.type.toLowerCase()} request`,
            staff: staff.name,
            time: getRelativeTime(request.approvedDate!)
          });
        }
      });

      // Add recent applications
      const recentApplications = allRequests
        .filter(r => r.status === 'Pending')
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        .slice(0, 2);

      recentApplications.forEach(request => {
        const staff = staffMembers.find(s => s.id === request.staffId);
        if (staff) {
          activities.push({
            action: `Applied for ${request.type.toLowerCase()}`,
            staff: staff.name,
            time: getRelativeTime(request.appliedDate)
          });
        }
      });

      setRecentActivity(activities.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleApprove = async (requestId: number) => {
    setProcessingRequestId(requestId);
    try {
      await api.updateLeaveRequestStatus(requestId, "Approved", "admin-1");
      toast({
        title: "Success",
        description: "Leave request approved successfully",
      });
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    
    setProcessingRequestId(selectedRequest.id);
    try {
      await api.updateLeaveRequestStatus(
        selectedRequest.id, 
        "Rejected", 
        "admin-1", 
        rejectionReason
      );
      toast({
        title: "Success",
        description: "Leave request rejected",
      });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const getPriorityColor = (days: number) => {
    if (days >= 7) return "text-red-600";
    if (days >= 3) return "text-yellow-600";
    return "text-green-600";
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage leave requests and monitor system activity</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/staff">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Staff
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Requests */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Pending Requests</h2>
                  <Button variant="outline" asChild>
                    <Link to="/admin/requests">View All</Link>
                  </Button>
                </div>
                
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{request.staffName || 'Unknown Staff'}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{request.department}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {request.type} • {formatDateRange(request.startDate, request.endDate)}
                          </div>
                          <div className={`text-sm font-medium ${getPriorityColor(request.days)}`}>
                            {request.days} day{request.days !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(request)}
                            disabled={processingRequestId === request.id}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={processingRequestId === request.id}
                          >
                            {processingRequestId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.staff}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/admin/staff">
                  <Users className="h-6 w-6" />
                  Manage Staff
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/admin/requests">
                  <FileText className="h-6 w-6" />
                  All Requests
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/admin/calendar">
                  <Calendar className="h-6 w-6" />
                  Leave Calendar
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/admin/reports">
                  <TrendingUp className="h-6 w-6" />
                  Generate Reports
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Staff Member</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.staffName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Department</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.department}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Leave Type</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-sm text-muted-foreground">
                  {formatDateRange(selectedRequest.startDate, selectedRequest.endDate)} ({selectedRequest.days} days)
                </p>
              </div>
              {selectedRequest.reason && (
                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Applied Date</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedRequest.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReject}
              disabled={!rejectionReason.trim() || processingRequestId !== null}
            >
              {processingRequestId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;