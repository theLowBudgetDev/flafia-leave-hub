
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Clock } from "lucide-react";
import { useState } from "react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const leaveEvents = [
    {
      date: "2024-12-23",
      name: "Your Annual Leave",
      type: "own",
      duration: "Dec 23 - Dec 30"
    },
    {
      date: "2024-12-25",
      name: "Christmas Holiday",
      type: "public",
      duration: "Dec 25"
    },
    {
      date: "2024-11-15",
      name: "Team Member Leave",
      type: "team",
      duration: "Nov 15"
    }
  ];

  const upcomingEvents = [
    {
      date: "Dec 23, 2024",
      title: "Your Annual Leave Starts",
      type: "Your Leave",
      color: "bg-primary"
    },
    {
      date: "Dec 25, 2024",
      title: "Christmas Day",
      type: "Public Holiday",
      color: "bg-accent"
    },
    {
      date: "Jan 1, 2025",
      title: "New Year's Day",
      type: "Public Holiday",
      color: "bg-accent"
    }
  ];

  const stats = [
    {
      icon: CalendarDays,
      label: "This Month",
      value: "3 Leave Days",
      color: "text-primary"
    },
    {
      icon: Users,
      label: "Team Status",
      value: "2 Members Away",
      color: "text-accent"
    },
    {
      icon: Clock,
      label: "Next Leave",
      value: "Dec 23, 2024",
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave Calendar</h1>
          <p className="text-muted-foreground">View leave schedules and plan your time off.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Calendar View</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Your Leave
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Public Holidays
                  </Badge>
                  <Badge variant="outline" className="bg-muted">
                    Team Leave
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Stats</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="font-semibold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-2 ${event.color}`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Legend</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm text-foreground">Your Leave Days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded"></div>
                  <span className="text-sm text-foreground">Public Holidays</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-muted border border-border rounded"></div>
                  <span className="text-sm text-foreground">Team Member Leave</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calendar;
