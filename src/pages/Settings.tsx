import { useState } from "react";
import { api } from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Bell, 
  Lock, 
  Mail, 
  Shield, 
  Smartphone, 
  Save, 
  Upload, 
  Loader2 
} from "lucide-react";

import { useEffect } from "react";
const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Profile settings
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+234 803 123 4567");
  const [department, setDepartment] = useState(user?.department || "");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [leaveUpdates, setLeaveUpdates] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Fetch settings from backend
  useEffect(() => {
    if (!user?.id) return;
    setSettingsLoading(true);
    setSettingsError(null);
    (async () => {
      try {
        const settings = await api.getSettings(user.id);
        setEmailNotifications(settings.emailNotifications);
        setPushNotifications(settings.pushNotifications);
        setLeaveUpdates(settings.leaveUpdates);
        setSystemAlerts(settings.systemAlerts);
      } catch (err: any) {
        setSettingsError("Failed to load settings");
      } finally {
        setSettingsLoading(false);
      }
    })();
  }, [user]);


  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setSettingsError(null);
    try {
      await api.saveSettings({
        staffId: user.id,
        emailNotifications,
        pushNotifications,
        leaveUpdates,
        systemAlerts,
      });
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (err: any) {
      setSettingsError("Failed to save settings");
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  const handleSaveSecurity = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been updated successfully.",
      });
    }, 1000);
  };

  const handleUploadAvatar = () => {
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64">
            <Card>
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl">
                      {name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUploadAvatar}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                </nav>
              </div>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Profile Information</h2>
                    <p className="text-sm text-muted-foreground">Update your personal information</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)} 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Contact HR to update your department</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Notification Preferences</h2>
                    <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Email Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Push Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                        </div>
                        <Switch 
                          id="push-notifications" 
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Notification Types</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="leave-updates" className="text-base">Leave Updates</Label>
                          <p className="text-sm text-muted-foreground">Updates about your leave requests</p>
                        </div>
                        <Switch 
                          id="leave-updates" 
                          checked={leaveUpdates}
                          onCheckedChange={setLeaveUpdates}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-alerts" className="text-base">System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Important system announcements</p>
                        </div>
                        <Switch 
                          id="system-alerts" 
                          checked={systemAlerts}
                          onCheckedChange={setSystemAlerts}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Security Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Change Password</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>
                        Update Password
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch 
                          id="two-factor" 
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                        />
                      </div>
                      
                      {twoFactorEnabled && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">Two-factor authentication is enabled</p>
                              <p className="text-sm text-muted-foreground">
                                You'll be asked for an authentication code when signing in on a new device.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Connected Devices</h3>
                      
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Current Device</p>
                              <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">Active</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Windows • Chrome • Last active now</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveSecurity}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;