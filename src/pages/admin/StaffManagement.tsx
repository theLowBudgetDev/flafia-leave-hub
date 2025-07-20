import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, Filter, Download, Users } from "lucide-react";

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const staff = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@fulafia.edu.ng",
      department: "Computer Science",
      position: "Senior Lecturer",
      staffId: "FULAFIA/CS/001",
      joinDate: "2020-01-15",
      leaveBalance: 25,
      usedLeave: 8,
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Michael Adams",
      email: "michael.adams@fulafia.edu.ng",
      department: "Mathematics",
      position: "Professor",
      staffId: "FULAFIA/MATH/002",
      joinDate: "2018-09-10",
      leaveBalance: 30,
      usedLeave: 12,
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Fatima Ali",
      email: "fatima.ali@fulafia.edu.ng",
      department: "Physics",
      position: "Lecturer",
      staffId: "FULAFIA/PHY/003",
      joinDate: "2021-03-01",
      leaveBalance: 22,
      usedLeave: 5,
      status: "Active"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "james.wilson@fulafia.edu.ng",
      department: "Chemistry",
      position: "Senior Lecturer",
      staffId: "FULAFIA/CHEM/004",
      joinDate: "2019-08-20",
      leaveBalance: 28,
      usedLeave: 15,
      status: "On Leave"
    }
  ];

  const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "English"];

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === "all" || member.department === filterDepartment)
  );

  const handleAddStaff = () => {
    setIsAddDialogOpen(false);
    // Add staff logic here
  };

  const handleEditStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStaff = (staffId: number) => {
    // Delete staff logic here
    console.log("Delete staff:", staffId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'on leave':
        return 'bg-warning/10 text-warning';
      case 'inactive':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
              <p className="text-muted-foreground">Manage university staff and their leave allocations</p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>Enter the details for the new staff member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input id="staffId" placeholder="FULAFIA/DEPT/000" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Enter position" />
                  </div>
                  <div>
                    <Label htmlFor="leaveBalance">Annual Leave Balance</Label>
                    <Input id="leaveBalance" type="number" placeholder="25" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddStaff} className="flex-1">Add Staff</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Staff List */}
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{member.name}</h3>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Email:</span> {member.email}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {member.department}
                      </div>
                      <div>
                        <span className="font-medium">Position:</span> {member.position}
                      </div>
                      <div>
                        <span className="font-medium">Staff ID:</span> {member.staffId}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-2">
                      <div>
                        <span className="font-medium">Join Date:</span> {member.joinDate}
                      </div>
                      <div>
                        <span className="font-medium">Leave Balance:</span> {member.leaveBalance} days
                      </div>
                      <div>
                        <span className="font-medium">Used Leave:</span> {member.usedLeave} days
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditStaff(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No staff found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>Update the staff member's details</DialogDescription>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" defaultValue={selectedStaff.name} />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedStaff.email} />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select defaultValue={selectedStaff.department}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-position">Position</Label>
                  <Input id="edit-position" defaultValue={selectedStaff.position} />
                </div>
                <div>
                  <Label htmlFor="edit-leaveBalance">Annual Leave Balance</Label>
                  <Input id="edit-leaveBalance" type="number" defaultValue={selectedStaff.leaveBalance} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsEditDialogOpen(false)} className="flex-1">Update</Button>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default StaffManagement;