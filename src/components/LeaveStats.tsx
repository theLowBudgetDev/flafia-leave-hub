import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Clock, CheckCircle } from "lucide-react";

export const LeaveStats = () => {
  const stats = [
    {
      icon: Calendar,
      label: "Total Applications",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      icon: Clock,
      label: "Pending Approval",
      value: "23",
      change: "-8%",
      changeType: "positive" as const
    },
    {
      icon: CheckCircle,
      label: "Approved This Month",
      value: "189",
      change: "+15%",
      changeType: "positive" as const
    },
    {
      icon: TrendingUp,
      label: "Processing Time",
      value: "2.3 days",
      change: "-23%",
      changeType: "positive" as const
    }
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            System Performance
          </h3>
          <p className="text-lg text-muted-foreground">
            Real-time statistics showing the efficiency of our digital leave management system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};