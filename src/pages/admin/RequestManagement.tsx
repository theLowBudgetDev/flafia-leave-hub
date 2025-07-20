import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Download, FileText, CheckCircle, XCircle, Eye, Calendar, Clock } from "lucide-react";

const RequestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");

  const requests = [
    {
      id: 1,
      staff: "Dr. Sarah Johnson",
      department: "Computer Science",
      type: "Annual Leave",
      startDate: "2025-01-15",
      endDate: "2025-01-22",
      days: 6,
      reason: "Family vacation",
      status: "Pending",
      submittedDate: "2025-01-08",
      priority: "Normal",
      coveringStaff: "Dr. Michael Brown"
    },
    {
      id: 2,
      staff: "Prof. Michael Adams",
      department: "Mathematics",
      type: "Sick Leave",
      startDate: "2025-01-12",
      endDate: "2025-01-14",
      days: 3,
      reason: "Medical treatment",
      status: "Pending",
      submittedDate: "2025-01-11",
      priority: "Urgent",
      coveringStaff: "Dr. Lisa Chen"
    },
    {
      id: 3,
      staff: "Dr. Fatima Ali",
      department: "Physics",
      type: "Conference",
      startDate: "2025-01-20",
      endDate: "2025-01-25",
      days: 4,
      reason: "International Physics Conference",
      status: "Approved",
      submittedDate: "2025-01-05",
      priority: "Normal",
      coveringStaff: "Prof. Ahmed Hassan"
    },
    {
      id: 4,
      staff: "Dr. James Wilson",
      department: "Chemistry",
      type: "Personal Leave",
      startDate: "2025-01-18",
      endDate: "2025-01-18",
      days: 1,
      reason: "Personal matters",
      status: "Rejected",
      submittedDate: "2025-01-10",
      priority: "Normal",
      coveringStaff: "Dr. Mary Brown"
    }
  ];

  const leaveTypes = ["Annual Leave", "Sick Leave", "Personal Leave", "Conference", "Study Leave", "Maternity Leave"];
  const statuses = ["Pending", "Approved", "Rejected"];

  const filteredRequests = requests.filter(request => 
    request.staff.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || request.status === filterStatus) &&
    (filterType === "all" || request.type === filterType)
  );

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleApprovalAction = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setIsApprovalDialogOpen(true);
  };

  const processApproval = () => {
    // Process approval/rejection logic here
    console.log(`${approvalAction} request:`, selectedRequest?.id);
    setIsApprovalDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-destructive/10 text-destructive';
      case 'high':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/50 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Request Management</h1>
              <p className="text-muted-foreground">Review and manage all leave requests</p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by staff name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {leaveTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-medium text-foreground">{request.staff}</h3>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Department:</span>
                        <p className="text-muted-foreground">{request.department}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Leave Type:</span>
                        <p className="text-muted-foreground">{request.type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Duration:</span>
                        <p className="text-muted-foreground">{request.days} day{request.days > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Dates:</span>
                        <p className="text-muted-foreground">{request.startDate} to {request.endDate}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Covering Staff:</span>
                        <p className="text-muted-foreground">{request.coveringStaff}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Submitted:</span>
                        <p className="text-muted-foreground">{request.submittedDate}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="font-medium text-foreground">Reason:</span>
                      <p className="text-muted-foreground text-sm">{request.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {request.status === "Pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprovalAction(request, "approve")}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleApprovalAction(request, "reject")}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </Card>

        {/* View Request Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>Complete information about the leave request</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-foreground">Staff Member:</span>
                    <p className="text-muted-foreground">{selectedRequest.staff}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Department:</span>
                    <p className="text-muted-foreground">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Leave Type:</span>
                    <p className="text-muted-foreground">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Duration:</span>
                    <p className="text-muted-foreground">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Start Date:</span>
                    <p className="text-muted-foreground">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">End Date:</span>
                    <p className="text-muted-foreground">{selectedRequest.endDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Status:</span>
                    <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Priority:</span>
                    <Badge className={getPriorityColor(selectedRequest.priority)}>{selectedRequest.priority}</Badge>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-foreground">Covering Staff:</span>
                  <p className="text-muted-foreground">{selectedRequest.coveringStaff}</p>
                </div>
                
                <div>
                  <span className="font-medium text-foreground">Reason:</span>
                  <p className="text-muted-foreground">{selectedRequest.reason}</p>
                </div>
                
                <div>
                  <span className="font-medium text-foreground">Submitted Date:</span>
                  <p className="text-muted-foreground">{selectedRequest.submittedDate}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {approvalAction === "approve" ? "Approve" : "Reject"} Leave Request
              </DialogTitle>
              <DialogDescription>
                {approvalAction === "approve" 
                  ? "Confirm approval of this leave request"
                  : "Provide a reason for rejecting this leave request"
                }
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">{selectedRequest.staff}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.type} - {selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.startDate} to {selectedRequest.endDate}</p>
                </div>
                
                {approvalAction === "reject" && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Reason for rejection:</label>
                    <Textarea placeholder="Please provide a reason for rejecting this request..." className="mt-1" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={processApproval} 
                    className="flex-1"
                    variant={approvalAction === "approve" ? "default" : "destructive"}
                  >
                    {approvalAction === "approve" ? "Approve Request" : "Reject Request"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default RequestManagement;