import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download,
  Printer,
  Filter,
  Loader2
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LeaveDetailsDialog } from "@/components/LeaveDetailsDialog";

// Mock leave data
const leaveData = [
  { 
    id: 1, 
    type: "Annual Leave", 
    startDate: "2024-12-23", 
    endDate: "2024-12-30", 
    days: 7, 
    status: "Approved", 
    appliedDate: "2024-11-15",
    approvedBy: "Admin User"
  },
  { 
    id: 2, 
    type: "Sick Leave", 
    startDate: "2024-11-15", 
    endDate: "2024-11-15", 
    days: 1, 
    status: "Pending", 
    appliedDate: "2024-11-10",
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
    approvedBy: "Admin User"
  }
];

// Mock team leave data
const teamLeaveData = [
  { 
    id: 101, 
    staffName: "Dr. Michael Adams", 
    department: "Mathematics",
    type: "Annual Leave", 
    startDate: "2024-12-15", 
    endDate: "2024-12-22", 
    days: 7, 
    status: "Approved"
  },
  { 
    id: 102, 
    staffName: "Dr. Fatima Ali", 
    department: "Physics",
    type: "Conference", 
    startDate: "2024-12-10", 
    endDate: "2024-12-15", 
    days: 5, 
    status: "Approved"
  },
  { 
    id: 103, 
    staffName: "Prof. James Wilson", 
    department: "Chemistry",
    type: "Sick Leave", 
    startDate: "2024-12-05", 
    endDate: "2024-12-07", 
    days: 2, 
    status: "Approved"
  }
];

const Calendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leaves for the selected date
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    // Combine personal and team leaves
    let allLeaves = [...leaveData, ...teamLeaveData];
    
    // Apply filters
    if (filterType === "personal") {
      allLeaves = leaveData;
    } else if (filterType === "approved") {
      allLeaves = allLeaves.filter(leave => leave.status.toLowerCase() === "approved");
    } else if (filterType === "pending") {
      allLeaves = allLeaves.filter(leave => leave.status.toLowerCase() === "pending");
    }
    
    return allLeaves.filter(leave => {
      const startDate = leave.startDate;
      const endDate = leave.endDate;
      
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Check if a date has any leaves
  const hasLeaves = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Combine personal and team leaves
    const allLeaves = [...leaveData, ...teamLeaveData];
    
    return allLeaves.some(leave => {
      const startDate = leave.startDate;
      const endDate = leave.endDate;
      
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Get status color
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

  const handleViewLeaveDetails = (leave: any) => {
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              {isFilterOpen && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Filter Leave Records</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={filterType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("all")}
                    >
                      All Records
                    </Button>
                    <Button 
                      variant={filterType === "personal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("personal")}
                    >
                      My Leave Only
                    </Button>
                    <Button 
                      variant={filterType === "approved" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("approved")}
                    >
                      Approved Only
                    </Button>
                    <Button 
                      variant={filterType === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("pending")}
                    >
                      Pending Only
                    </Button>
                  </div>
                </div>
              )}

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
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(leave.status)}`}>
                              {leave.status}
                            </span>
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