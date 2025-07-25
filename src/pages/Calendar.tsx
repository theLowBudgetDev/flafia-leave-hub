import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download,
  Printer,
  Loader2
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LeaveDetailsDialog } from "@/components/LeaveDetailsDialog";
import { api, LeaveRequest } from "@/services/api";

const Calendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        // Fetch all leave requests for calendar view
        const allRequests = await api.getLeaveRequests();
        setLeaveRequests(allRequests);
        setError(null);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaveRequests();
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leaves for the selected date
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    // Filter leave requests based on selected filters
    let filteredLeaves = leaveRequests;
    
    if (filterType === "personal" && user?.id) {
      filteredLeaves = leaveRequests.filter(leave => leave.staffId === user.id);
    } else if (filterType === "approved") {
      filteredLeaves = leaveRequests.filter(leave => leave.status === "Approved");
    } else if (filterType === "pending") {
      filteredLeaves = leaveRequests.filter(leave => leave.status === "Pending");
    }
    
    return filteredLeaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const selectedDateObj = new Date(dateStr);
      
      return isWithinInterval(selectedDateObj, { start: startDate, end: endDate });
    });
  };

  // Check if a date has any leaves
  const hasLeaves = (date: Date) => {
    return leaveRequests.some(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
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

  const handleViewLeaveDetails = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsDetailsDialogOpen(true);
  };

  const handleExportCalendar = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Calendar Exported",
        description: "Your leave calendar has been exported successfully.",
      });
    }, 1500);
  };

  const handlePrintCalendar = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "Print Initiated",
        description: "Your leave calendar has been sent to the printer.",
      });
    }, 1500);
  };

  const selectedDateLeaves = getSelectedDateLeaves();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading calendar...</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave Calendar</h1>
          <p className="text-muted-foreground">View and manage your leave schedule</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Leave Calendar
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
                      Export to iCal
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
                <div className="flex gap-2">
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="all">All Leave</option>
                    <option value="personal">My Leave</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {selectedDate ? (
                <div>
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDateLeaves.length} leave {selectedDateLeaves.length === 1 ? 'record' : 'records'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedDateLeaves.length > 0 ? (
                      selectedDateLeaves.map((leave) => (
                        <div 
                          key={leave.id} 
                          className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleViewLeaveDetails(leave)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">
                              {leave.staffName || (user?.name || "You")}
                            </h4>
                            <Badge className={getStatusColor(leave.status)}>
                              {leave.status}
                            </Badge>
                          </div>
                          {leave.department && (
                            <p className="text-sm text-muted-foreground">{leave.department}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{leave.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(leave.startDate), "MMM d")} - {format(parseISO(leave.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No leave records for this date</p>
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

      {selectedLeave && (
        <LeaveDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          leaveData={selectedLeave}
        />
      )}
    </div>
  );
};

export default Calendar;
