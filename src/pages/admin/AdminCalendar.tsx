import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

const AdminCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock leave data
  const leaveData = [
    { id: 1, staffName: "Dr. Sarah Johnson", department: "Computer Science", startDate: new Date(2024, 10, 15), endDate: new Date(2024, 10, 22), type: "Annual Leave", status: "Approved" },
    { id: 2, staffName: "Prof. Michael Adams", department: "Mathematics", startDate: new Date(2024, 10, 10), endDate: new Date(2024, 10, 14), type: "Sick Leave", status: "Approved" },
    { id: 3, staffName: "Dr. Fatima Ali", department: "Physics", startDate: new Date(2024, 10, 20), endDate: new Date(2024, 10, 25), type: "Conference", status: "Pending" },
    { id: 4, staffName: "Dr. James Wilson", department: "Chemistry", startDate: new Date(2024, 10, 18), endDate: new Date(2024, 10, 18), type: "Personal Leave", status: "Approved" },
  ];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leaves for the selected date
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return [];
    
    return leaveData.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      return (
        selectedDate >= leaveStart && 
        selectedDate <= leaveEnd
      );
    });
  };

  // Check if a date has any leaves
  const hasLeaves = (date: Date) => {
    return leaveData.some(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      return (
        date >= leaveStart && 
        date <= leaveEnd
      );
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

  const selectedDateLeaves = getSelectedDateLeaves();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave Calendar</h1>
          <p className="text-muted-foreground">View and manage all staff leave schedules in one place.</p>
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
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Leave Details</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {selectedDate ? (
                <div>
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDateLeaves.length} staff on leave
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedDateLeaves.length > 0 ? (
                      selectedDateLeaves.map((leave) => (
                        <div key={leave.id} className="p-3 border border-border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">{leave.staffName}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(leave.status)}`}>
                              {leave.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{leave.department}</p>
                          <p className="text-sm text-muted-foreground">{leave.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
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