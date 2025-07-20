import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, CheckCheck, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  link?: string;
  type: "leave" | "system" | "alert";
}

const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your annual leave request has been approved",
      time: "2 minutes ago",
      unread: true,
      link: "/history",
      type: "leave"
    },
    {
      id: 2,
      title: "New Leave Policy",
      message: "Updated leave policy is now available",
      time: "1 hour ago",
      unread: true,
      link: "/about",
      type: "system"
    },
    {
      id: 3,
      title: "Leave Balance Updated",
      message: "Your leave balance has been updated",
      time: "2 days ago",
      unread: false,
      link: "/dashboard",
      type: "leave"
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Sunday from 2-4 AM",
      time: "3 days ago",
      unread: false,
      type: "alert"
    },
    {
      id: 5,
      title: "Holiday Reminder",
      message: "University will be closed for the upcoming national holiday",
      time: "1 week ago",
      unread: false,
      type: "system"
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return notification.unread;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
    
    toast({
      title: "Notifications Updated",
      description: "All notifications marked as read",
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    
    toast({
      title: "Notification Removed",
      description: "The notification has been removed",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your leave requests and system announcements</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">
                  All
                  {notifications.length > 0 && <span className="ml-1 text-xs">({notifications.length})</span>}
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && <span className="ml-1 text-xs">({unreadCount})</span>}
                </TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="alert">Alerts</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg transition-colors ${notification.unread ? 'bg-muted/50 border-primary/20' : 'border-border'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <div className="flex gap-2">
                            {notification.unread && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            {notification.link && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link to={notification.link}>View</Link>
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === "all" 
                    ? "You don't have any notifications at the moment" 
                    : `You don't have any ${activeTab} notifications`}
                </p>
              </div>
            )}
          </TabsContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;

// Missing imports
import { Calendar, AlertCircle } from "lucide-react";