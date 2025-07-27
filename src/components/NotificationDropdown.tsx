
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, Notification } from "@/services/api";

export const NotificationDropdown = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const notifs = await api.getNotifications(user.id);
      setNotifications(notifs.slice(0, 10));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => n.unread)
        .map(n => api.markNotificationRead(n.id, true));
      
      await Promise.all(promises);
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        unread: false
      }));
      
      setNotifications(updatedNotifications);
      
      toast({
        title: "Notifications Updated",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id, true);
      
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      );
      
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      setNotifications(updatedNotifications);
      
      toast({
        title: "Notification Removed",
        description: "The notification has been removed",
      });
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-1"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className="flex-col items-start p-3 cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  {notification.link ? (
                    <Link to={notification.link} className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notification.title || 'Notification'}</p>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time || new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notification.title || 'Notification'}</p>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time || new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-primary" asChild>
          <Link to="/notifications" onClick={() => document.body.click()}>View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
