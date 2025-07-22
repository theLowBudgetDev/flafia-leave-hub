import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LeaveDetailsDialog } from "@/components/LeaveDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LeaveRequest {
  id: number;
  staffId?: string;
  staffName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  appliedDate: string;
  approvedBy?: string;
  reason?: string;
  priority?: string;
  rejectedReason?: string;
}

const RequestManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const itemsPerPage = 5;

  // Mock leave requests data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      staffName: "Dr. Sarah Johnson",
      department: "Computer Science",
      type: "Annual Leave",
      startDate: "2024-12-23",
      endDate: "2024-12-30",
      days: 7,
      status: "Approved",
      appliedDate: "2024-11-15",
      approvedBy: "Admin User",
      reason: "Family vacation planned months in advance."
    },
    {
      id: 2,
      staffName: "Prof. Michael Adams",
      department: "Mathematics",
      type: "Sick Leave",
      startDate: "2024-11-15",
      endDate: "2024-11-15",
      days: 1,
      status: "Pending",
      appliedDate: "2024-11-10",
      approvedBy: null,
      reason: "Medical appointment",
      priority: "Urgent"
    },
    {
      id: 3,
      staffName: "Dr. Fatima Ali",
      department: "Physics",
      type: "Conference",
      startDate: "2024-10-20",
      endDate: "2024-10-25",
      days: 5,
      status: "Pending",
      appliedDate: "2024-10-15",
      approvedBy: null,
      reason: "Attending the International Physics Conference to present research."
    },
    {
      id: 4,
      staffId: "staff-4",
      staffName: "Dr. James Wilson",
      department: "Chemistry",
      type: "Personal Leave",
      startDate: "2024-10-18",
      endDate: "2024-10-18",
      days: 1,
      status: "Rejected" as const,
      appliedDate: "2024-10-10",
      approvedBy: null,
      reason: "Family emergency",
      rejectedReason: "Insufficient staffing during critical department evaluation period."
    },
    {
      id: 5,
      staffName: "Prof. Lisa Chen",
      department: "Biology",
      type: "Research Leave",
      startDate: "2024-09-15",
      endDate: "2024-09-30",
      days: 15,
      status: "Approved",
      appliedDate: "2024-08-20",
      approvedBy: "Admin User",
      reason: "Field research in Amazon rainforest."
    },
    {
      id: 6,
      staffName: "Dr. Robert Brown",
      department: "Economics",
      type: "Annual Leave",
      startDate: "2024-08-10",
      endDate: "2024-08-20",
      days: 10,
      status: "Approved",
      appliedDate: "2024-07-15",
      approvedBy: "Admin User",
      reason: "Family vacation."
    },
    {
      id: 7,
      staffName: "Dr. Emily White",
      department: "Psychology",
      type: "Sick Leave",
      startDate: "2024-07-05",
      endDate: "2024-07-07",
      days: 2,
      status: "Approved",
      appliedDate: "2024-07-04",
      approvedBy: "Admin User",
      reason: "Recovering from flu."
    }
  ]);

  // Filter leave requests based on search query and status filter
  const filteredRequests = leaveRequests.filter(request => {
    // Filter by status
    if (statusFilter !== "all" && request.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.staffName.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query) ||
        request.type.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const openRejectDialog = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const handleApproveRequest = async (requestId: number) => {
    setProcessingRequestId(requestId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request status
    setLeaveRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: "Approved", approvedBy: "Admin User" } 
        : req
    ));
    
    toast({
      title: "Request Approved",
      description: "The leave request has been approved successfully.",
    });
    
    setProcessingRequestId(null);
    setIsDetailsDialogOpen(false);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setProcessingRequestId(selectedRequest.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request status
    setLeaveRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: "Rejected", rejectedReason: rejectionReason } 
        : req
    ));
    
    toast({
      title: "Request Rejected",
      description: "The leave request has been rejected.",
      variant: "destructive",
    });
    
    setProcessingRequestId(null);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      toast({
        title: "Export Successful",
        description: "Leave requests data has been exported to Excel.",
      });
      
      // In a real app, this would trigger a file download
      // window.location.href = '/api/export/leave-requests';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave Request Management</h1>
          <p className="text-muted-foreground">Review and manage all leave requests</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff or department..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isExporting || filteredRequests.length === 0}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </>
              )}
            </Button>
          </div>
          
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.staffName}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.days} day{request.days > 1 ? 's' : ''}</TableCell>
                      <TableCell>
                        {formatDate(request.startDate)}
                        {request.startDate !== request.endDate && ` - ${formatDate(request.endDate)}`}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(request.appliedDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            disabled={processingRequestId === request.id}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          {request.status === "Pending" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                disabled={processingRequestId === request.id}
                                className="text-success hover:text-success hover:bg-success/10"
                              >
                                {processingRequestId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span className="sr-only">Approve</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openRejectDialog(request)}
                                disabled={processingRequestId === request.id}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => setCurrentPage(index + 1)}
                            isActive={currentPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No leave requests found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your filters to see more results" 
                  : "There are no leave requests in the system yet"}
              </p>
            </div>
          )}
        </Card>
      </main>

      <Footer />
      
      {/* Leave Details Dialog */}
      {selectedRequest && (
        <LeaveDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          leaveData={selectedRequest}
        />
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
                <p className="text-sm font-medium">{selectedRequest.staffName}'s {selectedRequest.type}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedRequest.startDate)}
                  {selectedRequest.startDate !== selectedRequest.endDate && ` - ${formatDate(selectedRequest.endDate)}`}
                  {` (${selectedRequest.days} day${selectedRequest.days > 1 ? 's' : ''})`}
                </p>
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
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

export default RequestManagement;