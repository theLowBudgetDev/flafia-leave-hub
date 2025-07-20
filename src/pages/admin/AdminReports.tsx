import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Filter, Calendar, RefreshCcw } from "lucide-react";
import { useState } from "react";

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [department, setDepartment] = useState("all");

  // Mock data for charts
  const leaveTypeData = [
    { name: "Annual Leave", value: 45 },
    { name: "Sick Leave", value: 25 },
    { name: "Personal Leave", value: 15 },
    { name: "Study Leave", value: 8 },
    { name: "Maternity Leave", value: 5 },
    { name: "Other", value: 2 },
  ];

  const monthlyData = [
    { name: "Jan", annual: 5, sick: 3, personal: 2, other: 1 },
    { name: "Feb", annual: 7, sick: 4, personal: 1, other: 0 },
    { name: "Mar", annual: 3, sick: 2, personal: 3, other: 1 },
    { name: "Apr", annual: 4, sick: 5, personal: 2, other: 0 },
    { name: "May", annual: 6, sick: 3, personal: 1, other: 2 },
    { name: "Jun", annual: 8, sick: 2, personal: 0, other: 1 },
    { name: "Jul", annual: 10, sick: 1, personal: 2, other: 0 },
    { name: "Aug", annual: 12, sick: 3, personal: 1, other: 1 },
    { name: "Sep", annual: 9, sick: 4, personal: 2, other: 0 },
    { name: "Oct", annual: 7, sick: 6, personal: 3, other: 1 },
    { name: "Nov", annual: 5, sick: 3, personal: 2, other: 0 },
    { name: "Dec", annual: 15, sick: 2, personal: 1, other: 2 },
  ];

  const departmentData = [
    { name: "Computer Science", value: 25 },
    { name: "Mathematics", value: 18 },
    { name: "Physics", value: 15 },
    { name: "Chemistry", value: 12 },
    { name: "Biology", value: 10 },
    { name: "Engineering", value: 20 },
  ];

  const statusData = [
    { name: "Approved", value: 75 },
    { name: "Pending", value: 15 },
    { name: "Rejected", value: 10 },
  ];

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
  const STATUS_COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Analyze leave patterns and generate insights.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Data Refreshed",
                  description: "Report data has been refreshed with the latest information.",
                });
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Export Complete",
                  description: "Reports have been exported successfully.",
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Leave Requests</p>
              <p className="text-3xl font-bold text-foreground">247</p>
              <p className="text-xs text-success flex items-center">
                <span className="mr-1">↑</span> 12% from previous period
              </p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Processing Time</p>
              <p className="text-3xl font-bold text-foreground">2.3 days</p>
              <p className="text-xs text-success flex items-center">
                <span className="mr-1">↓</span> 0.5 days improvement
              </p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Approval Rate</p>
              <p className="text-3xl font-bold text-foreground">92%</p>
              <p className="text-xs text-success flex items-center">
                <span className="mr-1">↑</span> 3% from previous period
              </p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Staff Participation</p>
              <p className="text-3xl font-bold text-foreground">78%</p>
              <p className="text-xs text-success flex items-center">
                <span className="mr-1">↑</span> 5% from previous period
              </p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">By Department</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Leave Types Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {leaveTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Request Status</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Leave Requests by Department</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Department Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Leave Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Leave Trends</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="annual" stackId="a" fill="#8884d8" name="Annual Leave" />
                    <Bar dataKey="sick" stackId="a" fill="#82ca9d" name="Sick Leave" />
                    <Bar dataKey="personal" stackId="a" fill="#ffc658" name="Personal Leave" />
                    <Bar dataKey="other" stackId="a" fill="#ff8042" name="Other" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminReports;