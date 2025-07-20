
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, FileText, AlertCircle, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
    reason?: string;
    rejectedReason?: string;
  };
}

export const LeaveDetailsDialog = ({
  isOpen,
  onClose,
  leaveData,
}: LeaveDetailsDialogProps) => {
  const { toast } = useToast();
  const [isPrinting, setPrinting] = useState(false);
  const [isDownloading, setDownloading] = useState(false);

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

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
      toast({
        title: "Print Initiated",
        description: "The leave request details have been sent to your printer.",
      });
    }, 1000);
    // In a real app, this would trigger the browser's print functionality
    // window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast({
        title: "Download Complete",
        description: "The leave request details have been downloaded as a PDF.",
      });
    }, 1000);
    // In a real app, this would generate and download a PDF
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
                  <p className="font-medium">{formatDate(leaveData.startDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(leaveData.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {leaveData.reason && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="text-sm">{leaveData.reason}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Application Date</p>
              <p className="font-medium">{formatDate(leaveData.appliedDate)}</p>
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

          {leaveData.status.toLowerCase() === 'rejected' && leaveData.rejectedReason && (
            <div className="bg-destructive/10 border-l-4 border-destructive p-3 rounded">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Request Rejected</p>
                  <p className="text-sm text-muted-foreground">{leaveData.rejectedReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                Printing...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                Downloading...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
