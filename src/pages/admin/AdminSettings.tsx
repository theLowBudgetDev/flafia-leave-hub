import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCcw, AlertTriangle, Mail, Bell, Lock, User, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    institutionName: "Federal University, Lafia",
    systemEmail: "hr@fulafia.edu.ng",
    maxLeaveDays: 25,
    minAdvanceNotice: 7,
    fiscalYearStart: "january",
    maxCarryOverDays: 5,
    autoApproval: false,
    emailNotifications: true,
    minPasswordLength: 8,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  useEffect(() => {
    fetch('http://localhost:4000/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const saveSettings = async (settingsToSave: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave)
      });
      if (response.ok) {
        setSettings(prev => ({ ...prev, ...settingsToSave }));
        toast({ title: "Settings Saved", description: "Settings updated successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  };

  const resetSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/settings/reset', { method: 'POST' });
      if (response.ok) {
        const defaultSettings = await fetch('http://localhost:4000/api/admin/settings').then(res => res.json());
        setSettings(defaultSettings);
        toast({ title: "Settings Reset", description: "Settings reset to defaults." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reset settings.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">System Settings</h1>
          <p className="text-muted-foreground">Configure and customize the leave management system.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="mb-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="institution-name">Institution Name</Label>
                    <Input 
                      id="institution-name" 
                      value={settings.institutionName}
                      onChange={(e) => setSettings(prev => ({ ...prev, institutionName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="system-email">System Email</Label>
                    <Input 
                      id="system-email" 
                      value={settings.systemEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemEmail: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Leave Policy Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="max-leave-days">Maximum Annual Leave Days</Label>
                      <Input 
                        id="max-leave-days" 
                        type="number" 
                        value={settings.maxLeaveDays}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxLeaveDays: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="min-advance-notice">Minimum Advance Notice (days)</Label>
                      <Input 
                        id="min-advance-notice" 
                        type="number" 
                        value={settings.minAdvanceNotice}
                        onChange={(e) => setSettings(prev => ({ ...prev, minAdvanceNotice: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fiscal-year-start">Fiscal Year Start</Label>
                      <Select value={settings.fiscalYearStart} onValueChange={(value) => setSettings(prev => ({ ...prev, fiscalYearStart: value }))}>
                        <SelectTrigger id="fiscal-year-start">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="february">February</SelectItem>
                          <SelectItem value="march">March</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="may">May</SelectItem>
                          <SelectItem value="june">June</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="august">August</SelectItem>
                          <SelectItem value="september">September</SelectItem>
                          <SelectItem value="october">October</SelectItem>
                          <SelectItem value="november">November</SelectItem>
                          <SelectItem value="december">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="carry-over">Maximum Carry-Over Days</Label>
                      <Input 
                        id="carry-over" 
                        type="number" 
                        value={settings.maxCarryOverDays}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxCarryOverDays: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="auto-approval" 
                      checked={settings.autoApproval}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproval: checked }))}
                    />
                    <Label htmlFor="auto-approval">Enable automatic approval for requests under 3 days</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={() => saveSettings({
                    institutionName: settings.institutionName,
                    systemEmail: settings.systemEmail,
                    maxLeaveDays: settings.maxLeaveDays,
                    minAdvanceNotice: settings.minAdvanceNotice,
                    fiscalYearStart: settings.fiscalYearStart,
                    maxCarryOverDays: settings.maxCarryOverDays,
                    autoApproval: settings.autoApproval
                  })}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Notification Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Email Notifications</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="email-notifications" 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <Label htmlFor="email-notifications">Enable email notifications</Label>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 pl-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="new-request-email" defaultChecked />
                      <Label htmlFor="new-request-email">New leave requests</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="status-change-email" defaultChecked />
                      <Label htmlFor="status-change-email">Request status changes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="reminder-email" defaultChecked />
                      <Label htmlFor="reminder-email">Pending approval reminders</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="leave-start-email" defaultChecked />
                      <Label htmlFor="leave-start-email">Leave start/end reminders</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">System Notifications</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="system-notifications" defaultChecked />
                    <Label htmlFor="system-notifications">Enable in-app notifications</Label>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 pl-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="new-request-system" defaultChecked />
                      <Label htmlFor="new-request-system">New leave requests</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="status-change-system" defaultChecked />
                      <Label htmlFor="status-change-system">Request status changes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="reminder-system" defaultChecked />
                      <Label htmlFor="reminder-system">Pending approval reminders</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="system-alerts" defaultChecked />
                      <Label htmlFor="system-alerts">System alerts</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="email-template">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="minimal">Minimal Template</SelectItem>
                      <SelectItem value="formal">Formal Template</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                  <Button onClick={() => saveSettings({ emailNotifications: settings.emailNotifications })}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Password Policy</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="min-password-length">Minimum Password Length</Label>
                      <Input 
                        id="min-password-length" 
                        type="number" 
                        value={settings.minPasswordLength}
                        onChange={(e) => setSettings(prev => ({ ...prev, minPasswordLength: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input 
                        id="password-expiry" 
                        type="number" 
                        value={settings.passwordExpiry}
                        onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="require-uppercase" defaultChecked />
                      <Label htmlFor="require-uppercase">Require uppercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="require-lowercase" defaultChecked />
                      <Label htmlFor="require-lowercase">Require lowercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="require-numbers" defaultChecked />
                      <Label htmlFor="require-numbers">Require numbers</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="require-special" defaultChecked />
                      <Label htmlFor="require-special">Require special characters</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Session Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="session-timeout" 
                        type="number" 
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
                      <Input 
                        id="max-login-attempts" 
                        type="number" 
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="force-logout" defaultChecked />
                    <Label htmlFor="force-logout">Force logout after password change</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-md flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Security Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Changing security settings may require users to update their passwords or re-authenticate.
                      Make sure to communicate these changes to your staff.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={() => saveSettings({
                    minPasswordLength: settings.minPasswordLength,
                    passwordExpiry: settings.passwordExpiry,
                    sessionTimeout: settings.sessionTimeout,
                    maxLoginAttempts: settings.maxLoginAttempts
                  })}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">User Roles</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 border-2 border-primary">
                      <h4 className="font-medium text-foreground">Administrator</h4>
                      <p className="text-sm text-muted-foreground mb-2">Full system access</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Permissions Manager",
                            description: "Administrator permissions management opened.",
                          });
                        }}
                      >
                        Manage Permissions
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium text-foreground">HR Manager</h4>
                      <p className="text-sm text-muted-foreground mb-2">Approval & management</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Permissions Manager",
                            description: "HR Manager permissions management opened.",
                          });
                        }}
                      >
                        Manage Permissions
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium text-foreground">Staff</h4>
                      <p className="text-sm text-muted-foreground mb-2">Basic access</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Permissions Manager",
                            description: "Staff permissions management opened.",
                          });
                        }}
                      >
                        Manage Permissions
                      </Button>
                    </Card>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Add New Role",
                        description: "New role creation dialog opened.",
                      });
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Add New Role
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground">Department Management</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Add Department",
                          description: "Department creation dialog opened.",
                        });
                      }}
                    >
                      Add Department
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-3 gap-4 p-3 font-medium border-b">
                      <div>Department Name</div>
                      <div>Head of Department</div>
                      <div className="text-right">Actions</div>
                    </div>
                    
                    {["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"].map((dept, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0 items-center">
                        <div>{dept}</div>
                        <div>Dr. John Doe</div>
                        <div className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Edit Department",
                                description: "Department editing dialog opened.",
                              });
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end gap-3">
                  <Button onClick={() => saveSettings({})}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminSettings;