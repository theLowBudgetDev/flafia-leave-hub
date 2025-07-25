
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
import { api, LeaveRequest } from "@/services/api";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  link?: string;
  type?: "leave" | "system" | "alert";
  relatedRequestId?: number;
};

export const NotificationDropdown = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const requests = await api.getLeaveRequests(user.id);
      const generatedNotifications = generateNotifications(requests);
      setNotifications(generatedNotifications.slice(0, 5)); // Show only recent 5 notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (requests: LeaveRequest[]): Notification[] => {
    const notifications: Notification[] = [];
    let notificationId = 1;

    // Generate notifications for leave request status changes
    requests.forEach((request) => {
      if (request.status === 'Approved' && request.approvedDate) {
        const approvedDate = new Date(request.approvedDate);
        const daysSinceApproval = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        notifications.push({
          id: notificationId++,
          title: "Leave Request Approved",
          message: `Your ${request.type.toLowerCase()} request for ${request.days} day${request.days > 1 ? 's' : ''} has been approved`,
          time: getRelativeTime(request.approvedDate),
          unread: daysSinceApproval <= 1,
          link: "/history",
          type: "leave",
          relatedRequestId: request.id
        });
      }
      
      if (request.status === 'Rejected' && request.approvedDate) {
        const rejectedDate = new Date(request.approvedDate);
        const daysSinceRejection = Math.floor((Date.now() - rejectedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        notifications.push({
          id: notificationId++,
          title: "Leave Request Rejected",
          message: `Your ${request.type.toLowerCase()} request has been rejected${request.rejectedReason ? `: ${request.rejectedReason}` : ''}`,
          time: getRelativeTime(request.approvedDate),
          unread: daysSinceRejection <= 1,
          link: "/history",
          type: "alert",
          relatedRequestId: request.id
        });
      }
      
      if (request.status === 'Pending') {
        const appliedDate = new Date(request.appliedDate);
        const daysSinceApplication = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceApplication === 0) {
          notifications.push({
            id: notificationId++,
            title: "Leave Request Submitted",
            message: `Your ${request.type.toLowerCase()} request has been submitted and is pending approval`,
            time: getRelativeTime(request.appliedDate),
            unread: true,
            link: "/history",
            type: "leave",
            relatedRequestId: request.id
          });
        }
      }
    });

    // Add upcoming leave reminders
    const upcomingLeave = requests.filter(request => {
      if (request.status !== 'Approved') return false;
      const startDate = new Date(request.startDate);
      const today = new Date();
      const daysUntilLeave = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilLeave > 0 && daysUntilLeave <= 7;
    });

    upcomingLeave.forEach(request => {
      const startDate = new Date(request.startDate);
      const daysUntilLeave = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      notifications.push({
        id: notificationId++,
        title: "Upcoming Leave Reminder",
        message: `Your ${request.type.toLowerCase()} starts in ${daysUntilLeave} day${daysUntilLeave > 1 ? 's' : ''}`,
        time: "Today",
        unread: true,
        link: "/calendar",
        type: "leave",
        relatedRequestId: request.id
      });
    });

    // Sort by unread status first, then by time
    return notifications.sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return 0;
    });
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
                        <p className="font-medium text-sm">{notification.title}</p>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
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
