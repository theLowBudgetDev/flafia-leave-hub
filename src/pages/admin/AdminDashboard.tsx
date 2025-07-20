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

interface PendingRequest {
  id: number;
  staff: string;
  department: string;
  type: string;
  dates: string;
  days: number;
  priority: string;
  reason?: string;
}

interface Activity {
  action: string;
  staff: string;
  time: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);

  const [stats, setStats] = useState([
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
  ]);

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: 1,
      staff: "Dr. Sarah Johnson",
      department: "Computer Science",
      type: "Annual Leave",
      dates: "Jan 15 - Jan 22, 2025",
      days: 6,
      priority: "Normal",
      reason: "Family vacation planned months in advance."
    },
    {
      id: 2,
      staff: "Prof. Michael Adams",
      department: "Mathematics",
      type: "Sick Leave",
      dates: "Jan 12 - Jan 14, 2025",
      days: 3,
      priority: "Urgent",
      reason: "Medical procedure requiring recovery time."
    },
    {
      id: 3,
      staff: "Dr. Fatima Ali",
      department: "Physics",
      type: "Conference",
      dates: "Jan 20 - Jan 25, 2025",
      days: 4,
      priority: "Normal",
      reason: "Attending the International Physics Conference to present research."
    },
    {
      id: 4,
      staff: "Dr. James Wilson",
      department: "Chemistry",
      type: "Personal Leave",
      dates: "Jan 18, 2025",
      days: 1,
      priority: "Normal",
      reason: "Family emergency requiring immediate attention."
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    { action: "Approved leave request", staff: "Dr. Mary Brown", time: "2 hours ago" },
    { action: "Rejected leave request", staff: "Prof. David Lee", time: "4 hours ago" },
    { action: "New leave request", staff: "Dr. Lisa Chen", time: "6 hours ago" },
    { action: "Modified leave policy", staff: "System Admin", time: "1 day ago" }
  ]);

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

  const handleViewDetails = (request: PendingRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleApproveRequest = async (requestId: number) => {
    setProcessingRequestId(requestId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update pending requests
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    
    // Update stats
    setStats(prev => {
      const newStats = [...prev];
      // Decrease pending requests
      newStats[1] = {
        ...newStats[1],
        value: String(parseInt(newStats[1].value) - 1)
      };
      // Increase approved today
      newStats[2] = {
        ...newStats[2],
        value: String(parseInt(newStats[2].value) + 1)
      };
      return newStats;
    });
    
    // Add to recent activity
    const request = pendingRequests.find(req => req.id === requestId);
    if (request) {
      setRecentActivity(prev => [
        { action: `Approved ${request.type.toLowerCase()} request`, staff: request.staff, time: "Just now" },
        ...prev.slice(0, 3)
      ]);
    }
    
    toast({
      title: "Request Approved",
      description: `Leave request for ${request?.staff} has been approved.`,
    });
    
    setProcessingRequestId(null);
    setIsDetailsDialogOpen(false);
  };

  const openRejectDialog = (request: PendingRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setProcessingRequestId(selectedRequest.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update pending requests
    setPendingRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    
    // Update stats
    setStats(prev => {
      const newStats = [...prev];
      // Decrease pending requests
      newStats[1] = {
        ...newStats[1],
        value: String(parseInt(newStats[1].value) - 1)
      };
      return newStats;
    });
    
    // Add to recent activity
    setRecentActivity(prev => [
      { action: `Rejected ${selectedRequest.type.toLowerCase()} request`, staff: selectedRequest.staff, time: "Just now" },
      ...prev.slice(0, 3)
    ]);
    
    toast({
      title: "Request Rejected",
      description: `Leave request for ${selectedRequest.staff} has been rejected.`,
      variant: "destructive"
    });
    
    setProcessingRequestId(null);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
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
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
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
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={processingRequestId === request.id}
                        >
                          {processingRequestId === request.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openRejectDialog(request)}
                          disabled={processingRequestId === request.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                          disabled={processingRequestId === request.id}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending requests</p>
                  </div>
                )}
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

      {/* Leave Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>
                Review the details of this leave request
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Staff</p>
                  <p className="font-medium">{selectedRequest.staff}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Dates</p>
                <p className="font-medium">{selectedRequest.dates}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="text-sm">{selectedRequest.reason || "No reason provided"}</p>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openRejectDialog(selectedRequest);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    handleApproveRequest(selectedRequest.id);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {selectedRequest && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this leave request
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{selectedRequest.staff}'s {selectedRequest.type}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.dates} ({selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''})</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejecting this request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                  disabled={processingRequestId === selectedRequest.id}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={processingRequestId === selectedRequest.id}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectRequest}
                disabled={!rejectionReason.trim() || processingRequestId === selectedRequest.id}
              >
                {processingRequestId === selectedRequest.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;