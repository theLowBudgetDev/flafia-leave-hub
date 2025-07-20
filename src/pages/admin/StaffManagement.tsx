import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Save,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive";
}

const StaffManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state for adding/editing staff
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    status: "active" as "active" | "inactive"
  });
  
  // Mock staff data
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "staff-1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@fulafia.edu.ng",
      department: "Computer Science",
      position: "Senior Lecturer",
      joinDate: "2020-01-15",
      status: "active"
    },
    {
      id: "staff-2",
      name: "Prof. Michael Adams",
      email: "michael.adams@fulafia.edu.ng",
      department: "Mathematics",
      position: "Professor",
      joinDate: "2015-03-22",
      status: "active"
    },
    {
      id: "staff-3",
      name: "Dr. Fatima Ali",
      email: "fatima.ali@fulafia.edu.ng",
      department: "Physics",
      position: "Associate Professor",
      joinDate: "2018-09-10",
      status: "active"
    },
    {
      id: "staff-4",
      name: "Dr. James Wilson",
      email: "james.wilson@fulafia.edu.ng",
      department: "Chemistry",
      position: "Lecturer",
      joinDate: "2019-05-05",
      status: "inactive"
    },
    {
      id: "staff-5",
      name: "Prof. Lisa Chen",
      email: "lisa.chen@fulafia.edu.ng",
      department: "Biology",
      position: "Professor",
      joinDate: "2012-11-30",
      status: "active"
    }
  ]);

  // Filter staff based on search query
  const filteredStaff = staffList.filter(staff => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      staff.position.toLowerCase().includes(query)
    );
  });

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsViewDialogOpen(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      department: staff.department,
      position: staff.position,
      status: staff.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  const handleAddStaff = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      status: "active"
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveNewStaff = () => {
    setIsProcessing(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const newStaff: Staff = {
        id: `staff-${staffList.length + 1}`,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        joinDate: new Date().toISOString().split('T')[0],
        status: formData.status
      };
      
      setStaffList([...staffList, newStaff]);
      
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully.",
      });
      
      setIsProcessing(false);
      setIsAddDialogOpen(false);
    }, 1000);
  };

  const handleUpdateStaff = () => {
    if (!selectedStaff) return;
    
    setIsProcessing(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setStaffList(staffList.map(staff => 
        staff.id === selectedStaff.id
          ? { ...staff, ...formData }
          : staff
      ));
      
      toast({
        title: "Staff Updated",
        description: "Staff information has been updated successfully.",
      });
      
      setIsProcessing(false);
      setIsEditDialogOpen(false);
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (!selectedStaff) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setStaffList(staffList.filter(staff => staff.id !== selectedStaff.id));
      
      toast({
        title: "Staff Removed",
        description: "Staff member has been removed successfully.",
      });
      
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff records and information</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddStaff}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
          
          {filteredStaff.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>{formatDate(staff.joinDate)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          staff.status === "active" 
                            ? "bg-success/20 text-success" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {staff.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewStaff(staff)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditStaff(staff)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStaff(staff)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No staff found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search to find more results" 
                  : "Add staff members to get started"}
              </p>
            </div>
          )}
        </Card>
      </main>

      <Footer />
      
      {/* View Staff Dialog */}
      {selectedStaff && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Staff Details</DialogTitle>
              <DialogDescription>
                View detailed information about this staff member
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedStaff.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedStaff.department}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{selectedStaff.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{formatDate(selectedStaff.joinDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedStaff.status === "active" 
                      ? "bg-success/20 text-success" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {selectedStaff.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleEditStaff(selectedStaff);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Enter the details for the new staff member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isProcessing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input 
                  id="department" 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  disabled={isProcessing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input 
                  id="position" 
                  value={formData.position} 
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}
                disabled={isProcessing}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewStaff}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Staff Dialog */}
      {selectedStaff && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Staff</DialogTitle>
              <DialogDescription>
                Update information for {selectedStaff.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <Input 
                    id="edit-department" 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position *</Label>
                  <Input 
                    id="edit-position" 
                    value={formData.position} 
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}
                  disabled={isProcessing}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStaff}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {selectedStaff && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this staff member? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Warning</p>
                <p className="text-sm text-muted-foreground">
                  Removing {selectedStaff.name} will delete all associated records including leave history.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Staff"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StaffManagement;