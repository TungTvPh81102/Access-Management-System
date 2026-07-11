'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, Printer, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { useRegistration, useApproveRegistration, useRejectRegistration, useAddComment } from '@/features/registrations/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/workflow/status-badge';
import { ApprovalStepper } from '@/components/workflow/approval-stepper';
import { ApprovalTimeline } from '@/components/workflow/approval-timeline';
import { CommentBox } from '@/components/workflow/comment-box';
import { ApprovalDialogs } from '@/components/workflow/approval-dialogs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export function VisitorDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: registration, isLoading, isError } = useRegistration(id);
  
  const approveMut = useApproveRegistration();
  const rejectMut = useRejectRegistration();
  const commentMut = useAddComment();

  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);

  if (isError) {
    return <div className="p-8 text-center text-destructive">Failed to load registration details.</div>;
  }

  if (isLoading || !registration) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleApprove = (comment: string) => {
    approveMut.mutate(
      { id, comment },
      {
        onSuccess: () => {
          toast.success('Request approved successfully');
          setOpenApprove(false);
        },
        onError: () => toast.error('Failed to approve request')
      }
    );
  };

  const handleReject = (reason: string) => {
    rejectMut.mutate(
      { id, reason },
      {
        onSuccess: () => {
          toast.success('Request rejected');
          setOpenReject(false);
        },
        onError: () => toast.error('Failed to reject request')
      }
    );
  };

  const handleAddComment = (content: string) => {
    commentMut.mutate({ id, content });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{registration.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-muted-foreground">{registration.id}</span>
              <Separator orientation="vertical" className="h-4" />
              <StatusBadge status={registration.status} />
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">
                Applied on {format(new Date(registration.createdAt), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {registration.status === 'pending' && (
            <>
              <Button variant="outline" className="text-status-danger border-status-danger hover:bg-status-danger hover:text-white" onClick={() => setOpenReject(true)}>
                Reject
              </Button>
              <Button className="bg-status-success text-white hover:bg-status-success/90" onClick={() => setOpenApprove(true)}>
                Approve
              </Button>
            </>
          )}
          <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>

      <ApprovalStepper steps={registration.approvalSteps} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-sm text-muted-foreground">Visitor Name</p>
                  <p className="font-medium">{registration.data.visitorName as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{registration.data.visitorCompany as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID / Passport Number</p>
                  <p className="font-medium">{registration.data.idNumber as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{registration.data.phone as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{registration.data.email as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Plate</p>
                  <p className="font-medium">{registration.data.vehiclePlate as string || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-sm text-muted-foreground">Purpose of Visit</p>
                  <p className="font-medium">{registration.data.purpose as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Host</p>
                  <p className="font-medium">{registration.data.hostName as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Visit</p>
                  <p className="font-medium">
                    {registration.data.visitDate ? format(new Date(registration.data.visitDate as string), 'MMMM d, yyyy') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Time</p>
                  <p className="font-medium">{registration.data.timeFrame as string || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guest Wi-Fi</p>
                  <p className="font-medium">{registration.data.needsWifi ? 'Requested' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lunch Provided</p>
                  <p className="font-medium">{registration.data.needsLunch ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Workflow & Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{registration.applicantName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{registration.applicantDepartment}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-[500px]">
            <CardHeader className="pb-2">
              <Tabs defaultValue="timeline">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({registration.comments.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="mt-4 overflow-y-auto h-[380px] pr-2">
                  <ApprovalTimeline steps={registration.approvalSteps} />
                </TabsContent>
                
                <TabsContent value="comments" className="mt-4 flex-1 h-[380px]">
                  <CommentBox 
                    comments={registration.comments} 
                    onAddComment={handleAddComment} 
                    isSubmitting={commentMut.isPending}
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>

      <ApprovalDialogs
        openApprove={openApprove}
        onOpenApproveChange={setOpenApprove}
        openReject={openReject}
        onOpenRejectChange={setOpenReject}
        onConfirmApprove={handleApprove}
        onConfirmReject={handleReject}
        isSubmitting={approveMut.isPending || rejectMut.isPending}
      />
    </div>
  );
}
