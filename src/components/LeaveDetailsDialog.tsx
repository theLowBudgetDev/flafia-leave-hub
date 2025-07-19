
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, FileText } from "lucide-react";

interface LeaveDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leaveData: {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
    appliedDate: string;
    approvedBy: string | null;
  };
}

export const LeaveDetailsDialog = ({
  isOpen,
  onClose,
  leaveData,
}: LeaveDetailsDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Leave Request Details
            <Badge className={`${getStatusColor(leaveData.status)} border`}>
              {leaveData.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about your leave request
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Leave Type
              </div>
              <p className="font-medium">{leaveData.type}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p className="font-medium">{leaveData.days} day{leaveData.days > 1 ? 's' : ''}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Leave Period
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{leaveData.startDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{leaveData.endDate}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Application Date</p>
              <p className="font-medium">{leaveData.appliedDate}</p>
            </div>

            {leaveData.approvedBy && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Approved By
                </div>
                <p className="font-medium">{leaveData.approvedBy}</p>
              </div>
            )}
          </div>

          {leaveData.status.toLowerCase() === 'pending' && (
            <div className="bg-warning/10 border-l-4 border-warning p-3 rounded">
              <p className="text-sm text-warning-foreground">
                Your leave request is currently under review. You will be notified once a decision is made.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
