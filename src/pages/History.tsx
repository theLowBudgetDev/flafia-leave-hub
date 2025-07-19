
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Download } from "lucide-react";
import { useState } from "react";
import { LeaveDetailsDialog } from "@/components/LeaveDetailsDialog";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const leaveHistory = [
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2024-12-23",
      endDate: "2024-12-30",
      days: 7,
      status: "Approved",
      appliedDate: "2024-12-01",
      approvedBy: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2024-11-15",
      endDate: "2024-11-15",
      days: 1,
      status: "Pending",
      appliedDate: "2024-11-14",
      approvedBy: null
    },
    {
      id: 3,
      type: "Personal Leave",
      startDate: "2024-10-20",
      endDate: "2024-10-21",
      days: 2,
      status: "Approved",
      appliedDate: "2024-10-15",
      approvedBy: "Prof. Michael Davis"
    },
    {
      id: 4,
      type: "Study Leave",
      startDate: "2024-09-05",
      endDate: "2024-09-06",
      days: 2,
      status: "Rejected",
      appliedDate: "2024-08-25",
      approvedBy: "Dr. Sarah Johnson"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const filteredHistory = leaveHistory.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (leave: any) => {
    setSelectedLeave(leave);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave History</h1>
          <p className="text-muted-foreground">View and manage all your leave requests.</p>
        </div>

        <Card className="p-6 mb-6">
          {/* Improved tablet layout - single row on tablet and desktop */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by leave type or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leave requests found matching your criteria.</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{item.type}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Duration:</span> {item.startDate} to {item.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Days:</span> {item.days} day{item.days > 1 ? 's' : ''}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span> {item.appliedDate}
                        </div>
                      </div>
                      
                      {item.approvedBy && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Approved by:</span> {item.approvedBy}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>

      <Footer />

      {selectedLeave && (
        <LeaveDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          leaveData={selectedLeave}
        />
      )}
    </div>
  );
};

export default History;
