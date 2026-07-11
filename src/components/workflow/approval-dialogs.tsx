import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApprovalDialogsProps {
  openApprove: boolean;
  onOpenApproveChange: (open: boolean) => void;
  openReject: boolean;
  onOpenRejectChange: (open: boolean) => void;
  onConfirmApprove: (comment: string) => void;
  onConfirmReject: (reason: string) => void;
  isSubmitting?: boolean;
}

export function ApprovalDialogs({
  openApprove,
  onOpenApproveChange,
  openReject,
  onOpenRejectChange,
  onConfirmApprove,
  onConfirmReject,
  isSubmitting = false
}: ApprovalDialogsProps) {
  const [approveComment, setApproveComment] = React.useState('');
  const [rejectReason, setRejectReason] = React.useState('');

  return (
    <>
      <Dialog open={openApprove} onOpenChange={onOpenApproveChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this request? You can add an optional comment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="approve-comment">Comment (Optional)</Label>
              <Textarea 
                id="approve-comment" 
                placeholder="Looks good..." 
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenApproveChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={() => onConfirmApprove(approveComment)} disabled={isSubmitting} className="bg-status-success text-status-success-foreground hover:bg-status-success/90">
              {isSubmitting ? 'Approving...' : 'Confirm Approval'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openReject} onOpenChange={onOpenRejectChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this request? A reason is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject-reason" className="text-destructive">Reason (Required) *</Label>
              <Textarea 
                id="reject-reason" 
                placeholder="Missing documentation..." 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className={rejectReason.length === 0 ? 'border-destructive' : ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenRejectChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => onConfirmReject(rejectReason)} 
              disabled={isSubmitting || rejectReason.trim().length === 0}
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
