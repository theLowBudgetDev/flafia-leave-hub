import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, LeaveRequest } from "@/services/api";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  Calendar,
  FileText,
  Settings,
  Trash2,
  MailOpen,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Notification } from "@/services/api";

const Notifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const notifs = await api.getNotifications(user.id);
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "system":
        return <Info className="h-5 w-5 text-green-600" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "leave":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "system":
        return "bg-green-100 text-green-800 border-green-200";
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId, true);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId, false);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, unread: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => n.unread)
        .map(n => api.markNotificationRead(n.id, true));
      
      await Promise.all(promises);
      
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been updated",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case "unread":
        return notification.unread;
      case "leave":
        return notification.type === "leave";
      case "system":
        return notification.type === "system" || notification.type === "alert";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="leave">
                Leave ({notifications.filter(n => n.type === "leave").length})
              </TabsTrigger>
              <TabsTrigger value="system">
                System ({notifications.filter(n => n.type === "system" || n.type === "alert").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`p-4 transition-all hover:shadow-md ${
                        notification.unread ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h3>
                                <Badge className={getNotificationBadgeColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{notification.time}</span>
                                {notification.link && (
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                                    <Link to={notification.link}>
                                      View Details <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {notification.unread ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnread(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <MailOpen className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8">
                  <div className="text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === "unread" 
                        ? "You're all caught up! No unread notifications."
                        : `No ${activeTab === "all" ? "" : activeTab + " "}notifications to display.`
                      }
                    </p>
                    {activeTab === "all" && (
                      <Button variant="outline" asChild>
                        <Link to="/apply-leave">
                          <FileText className="h-4 w-4 mr-2" />
                          Apply for Leave
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;