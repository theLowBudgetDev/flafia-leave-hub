import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Clock, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/services/api";

export const LeaveStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getLeaveStats();
      setStats([
        {
          icon: Calendar,
          label: "Total Applications",
          value: data.totalApplications.toLocaleString(),
          change: "+12%",
          changeType: "positive" as const
        },
        {
          icon: Clock,
          label: "Pending Approval",
          value: data.pendingApproval.toString(),
          change: data.pendingApproval > 10 ? "High" : "Normal",
          changeType: data.pendingApproval > 10 ? "negative" : "positive" as const
        },
        {
          icon: CheckCircle,
          label: "Approved This Month",
          value: data.approvedThisMonth.toString(),
          change: "+15%",
          changeType: "positive" as const
        },
        {
          icon: TrendingUp,
          label: "Processing Time",
          value: data.processingTime,
          change: "Avg time",
          changeType: "positive" as const
        }
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats on error
      setStats([
        {
          icon: Calendar,
          label: "Total Applications",
          value: "0",
          change: "N/A",
          changeType: "positive" as const
        },
        {
          icon: Clock,
          label: "Pending Approval",
          value: "0",
          change: "N/A",
          changeType: "positive" as const
        },
        {
          icon: CheckCircle,
          label: "Approved This Month",
          value: "0",
          change: "N/A",
          changeType: "positive" as const
        },
        {
          icon: TrendingUp,
          label: "Processing Time",
          value: "N/A",
          change: "N/A",
          changeType: "positive" as const
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

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