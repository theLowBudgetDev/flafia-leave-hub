import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, LeaveRequest, Staff } from "@/services/api";

const AdminReports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("this-year");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [requestsData, staffData] = await Promise.all([
        api.getLeaveRequests(),
        api.getStaffMembers()
      ]);
      setLeaveRequests(requestsData);
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected period and department
  const filteredRequests = leaveRequests.filter(request => {
    const requestDate = new Date(request.appliedDate);
    const now = new Date();
    
    // Filter by period
    let periodMatch = true;
    switch (selectedPeriod) {
      case "this-month":
        periodMatch = requestDate.getMonth() === now.getMonth() && 
                     requestDate.getFullYear() === now.getFullYear();
        break;
      case "last-month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        periodMatch = requestDate.getMonth() === lastMonth.getMonth() && 
                     requestDate.getFullYear() === lastMonth.getFullYear();
        break;
      case "this-year":
        periodMatch = requestDate.getFullYear() === now.getFullYear();
        break;
      case "last-year":
        periodMatch = requestDate.getFullYear() === now.getFullYear() - 1;
        break;
    }
    
    // Filter by department
    const departmentMatch = selectedDepartment === "all" || 
                           request.department === selectedDepartment;
    
    return periodMatch && departmentMatch;
  });

  // Calculate statistics
  const totalRequests = filteredRequests.length;
  const approvedRequests = filteredRequests.filter(r => r.status === 'Approved').length;
  const pendingRequests = filteredRequests.filter(r => r.status === 'Pending').length;
  const rejectedRequests = filteredRequests.filter(r => r.status === 'Rejected').length;
  const totalDaysRequested = filteredRequests.reduce((sum, r) => sum + r.days, 0);
  const averageDaysPerRequest = totalRequests > 0 ? (totalDaysRequested / totalRequests).toFixed(1) : "0";

  // Leave types data for pie chart
  const leaveTypesData = filteredRequests.reduce((acc, request) => {
    const existing = acc.find(item => item.name === request.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: request.type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly trends data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', { month: 'short' });
    const monthRequests = leaveRequests.filter(request => {
      const requestDate = new Date(request.appliedDate);
      return requestDate.getMonth() === i && requestDate.getFullYear() === 2024;
    });
    
    return {
      month,
      requests: monthRequests.length,
      approved: monthRequests.filter(r => r.status === 'Approved').length,
      rejected: monthRequests.filter(r => r.status === 'Rejected').length
    };
  });

  // Department statistics
  const departments = Array.from(new Set(staff.map(s => s.department).filter(Boolean)));
  const departmentStats = departments.map(dept => {
    const deptRequests = filteredRequests.filter(r => r.department === dept);
    const deptStaff = staff.filter(s => s.department === dept);
    
    return {
      department: dept,
      totalStaff: deptStaff.length,
      totalRequests: deptRequests.length,
      approvedRequests: deptRequests.filter(r => r.status === 'Approved').length,
      averageDays: deptRequests.length > 0 ? 
        (deptRequests.reduce((sum, r) => sum + r.days, 0) / deptRequests.length).toFixed(1) : "0"
    };
  });

  // Top leave requesters
  const staffRequestCounts = staff.map(member => {
    const memberRequests = filteredRequests.filter(r => r.staffName === member.name);
    return {
      name: member.name,
      department: member.department,
      totalRequests: memberRequests.length,
      totalDays: memberRequests.reduce((sum, r) => sum + r.days, 0),
      approvedDays: memberRequests.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.days, 0)
    };
  }).sort((a, b) => b.totalDays - a.totalDays).slice(0, 10);

  const exportToCSV = () => {
    const headers = ['Staff Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRequests.map(request => [
        request.staffName,
        request.department || '',
        request.type,
        request.startDate,
        request.endDate,
        request.days,
        request.status,
        request.appliedDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-report-${selectedPeriod}-${selectedDepartment}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive leave management insights and statistics</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept || ""}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                {approvedRequests} approved, {pendingRequests} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {rejectedRequests} rejected requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysRequested}</div>
              <p className="text-xs text-muted-foreground">
                {averageDaysPerRequest} days average per request
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {departments.length} departments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Leave Types Distribution */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Leave Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Monthly Leave Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Total Requests" />
                  <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Statistics */}
        <Card className="p-6 mb-8">
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Staff</TableHead>
                    <TableHead>Total Requests</TableHead>
                    <TableHead>Approved Requests</TableHead>
                    <TableHead>Average Days</TableHead>
                    <TableHead>Approval Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStats.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>{dept.totalStaff}</TableCell>
                      <TableCell>{dept.totalRequests}</TableCell>
                      <TableCell>{dept.approvedRequests}</TableCell>
                      <TableCell>{dept.averageDays}</TableCell>
                      <TableCell>
                        {dept.totalRequests > 0 ? 
                          Math.round((dept.approvedRequests / dept.totalRequests) * 100) : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Leave Requesters */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Top Leave Requesters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Requests</TableHead>
                    <TableHead>Total Days Requested</TableHead>
                    <TableHead>Approved Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffRequestCounts.map((staff) => (
                    <TableRow key={staff.name}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.department || 'N/A'}</TableCell>
                      <TableCell>{staff.totalRequests}</TableCell>
                      <TableCell>{staff.totalDays}</TableCell>
                      <TableCell>{staff.approvedDays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AdminReports;