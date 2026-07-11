import type { ApprovalStep } from '@/types';
import { format } from 'date-fns';
import { User, Check, X, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from './status-badge';

export function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-6 pl-4 border-l-2 border-muted ml-4">
      {steps.map((step, index) => {
        let Icon = Clock;
        let iconColor = 'text-status-warning bg-status-warning-bg';

        if (step.status === 'approved') {
          Icon = Check;
          iconColor = 'text-status-success bg-status-success-bg';
        } else if (step.status === 'rejected') {
          Icon = X;
          iconColor = 'text-status-danger bg-status-danger-bg';
        }

        return (
          <div key={step.id} className="relative">
            <span className={`absolute -left-[29px] flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-background ${iconColor}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex flex-col space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">{step.approverName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{step.approverName}</span>
                  <span className="text-xs text-muted-foreground">({step.approverRole})</span>
                </div>
                {step.decidedAt && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(step.decidedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={step.status} />
                {step.comment && (
                  <span className="text-sm text-muted-foreground italic">&quot;{step.comment}&quot;</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
