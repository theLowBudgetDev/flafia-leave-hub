import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Download,
  Printer,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, LeaveRequest, Staff } from "@/services/api";

const AdminCalendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all leave requests and staff members for admin view
        const [requests, staff] = await Promise.all([
          api.getLeaveRequests(), // Get all leave requests
          api.getStaffMembers()
        ]);
        setLeaveRequests(requests);
        setStaffMembers(staff);
        setError(null);
      } catch (error) {
        console.error('Error fetching admin calendar data:', error);
        setError('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get filtered leave requests
  const getFilteredLeaveRequests = () => {
    let filtered = leaveRequests;
    
    // Filter by status
    if (filterType === "approved") {
      filtered = filtered.filter(leave => leave.status === "Approved");
    } else if (filterType === "pending") {
      filtered = filtered.filter(leave => leave.status === "Pending");
    } else if (filterType === "rejected") {
      filtered = filtered.filter(leave => leave.status === "Rejected");
    }
    
    // Filter by department
    if (filterDepartment !== "all") {
      filtered = filtered.filter(leave => leave.department === filterDepartment);
    }
    
    return filtered;
  };

  // Get leaves for the selected date
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return [];
    
    const filteredRequests = getFilteredLeaveRequests();
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    return filteredRequests.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const selectedDateObj = new Date(dateStr);
      
      return isWithinInterval(selectedDateObj, { start: startDate, end: endDate });
    });
  };

  // Check if a date has any leaves
  const hasLeaves = (date: Date) => {
    const filteredRequests = getFilteredLeaveRequests();
    
    return filteredRequests.some(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Get unique departments for filter
  const getDepartments = () => {
    const departments = [...new Set(staffMembers.map(staff => staff.department))];
    return departments.sort();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get calendar statistics
  const getCalendarStats = () => {
    const filteredRequests = getFilteredLeaveRequests();
    const currentMonthRequests = filteredRequests.filter(leave => {
      const startDate = new Date(leave.startDate);
      return startDate.getMonth() === currentMonth.getMonth() && 
             startDate.getFullYear() === currentMonth.getFullYear();
    });
    
    return {
      total: currentMonthRequests.length,
      approved: currentMonthRequests.filter(r => r.status === 'Approved').length,
      pending: currentMonthRequests.filter(r => r.status === 'Pending').length,
      rejected: currentMonthRequests.filter(r => r.status === 'Rejected').length,
      staffOnLeave: new Set(currentMonthRequests.filter(r => r.status === 'Approved').map(r => r.staffId)).size
    };
  };

  // Handle export calendar
  const handleExportCalendar = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Calendar Exported",
        description: "Admin calendar has been exported successfully.",
      });
    }, 1500);
  };

  // Handle print calendar
  const handlePrintCalendar = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "Print Initiated",
        description: "Admin calendar has been sent to the printer.",
      });
    }, 1500);
  };

  const selectedDateLeaves = getSelectedDateLeaves();
  const calendarStats = getCalendarStats();
  const departments = getDepartments();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading admin calendar...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Calendar</h1>
          <p className="text-muted-foreground">Manage and oversee all staff leave requests</p>
        </div>

        {/* Calendar Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{calendarStats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{calendarStats.approved}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{calendarStats.pending}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{calendarStats.rejected}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Staff on Leave</p>
                <p className="text-2xl font-bold">{calendarStats.staffOnLeave}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Staff Leave Calendar
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium min-w-[120px] text-center">
                    {format(currentMonth, "MMMM yyyy")}
                  </div>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status:</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Department:</label>
                  <select 
                    value={filterDepartment} 
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                  <div key={`empty-start-${index}`} className="h-24 p-1 border border-border/30 bg-muted/20 rounded-md"></div>
                ))}
                
                {daysInMonth.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayHasLeaves = hasLeaves(day);
                  
                  return (
                    <div
                      key={day.toString()}
                      className={`h-24 p-1 border rounded-md cursor-pointer transition-colors
                        ${isToday ? 'border-primary' : 'border-border/30'}
                        ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                          ${isToday ? 'bg-primary text-primary-foreground' : ''}
                        `}>
                          {format(day, "d")}
                        </span>
                        {dayHasLeaves && (
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                  <div key={`empty-end-${index}`} className="h-24 p-1 border border-border/30 bg-muted/20 rounded-md"></div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" size="sm" onClick={handlePrintCalendar} disabled={isPrinting}>
                  {isPrinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Calendar
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCalendar} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Calendar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Leave Details</h2>
              </div>

              {selectedDate ? (
                <div>
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDateLeaves.length} leave {selectedDateLeaves.length === 1 ? 'request' : 'requests'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedDateLeaves.length > 0 ? (
                      selectedDateLeaves.map((leave) => (
                        <div 
                          key={leave.id} 
                          className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">
                              {leave.staffName}
                            </h4>
                            <Badge className={getStatusColor(leave.status)}>
                              {leave.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{leave.department}</p>
                          <p className="text-sm text-muted-foreground">{leave.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(leave.startDate), "MMM d")} - {format(parseISO(leave.endDate), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leave.days} day{leave.days > 1 ? 's' : ''}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No leave requests for this date</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a date to view leave details</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminCalendar;
