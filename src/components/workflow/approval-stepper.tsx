import type { ApprovalStep } from '@/types';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { format } from 'date-fns';

export function ApprovalStepper({ steps }: { steps: ApprovalStep[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex items-center w-full my-6 overflow-x-auto pb-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        let Icon = Clock;
        let iconColor = 'text-status-warning';
        let bgColor = 'bg-status-warning-bg';
        let borderColor = 'border-status-warning';

        if (step.status === 'approved') {
          Icon = Check;
          iconColor = 'text-status-success';
          bgColor = 'bg-status-success-bg';
          borderColor = 'border-status-success';
        } else if (step.status === 'rejected') {
          Icon = X;
          iconColor = 'text-status-danger';
          bgColor = 'bg-status-danger-bg';
          borderColor = 'border-status-danger';
        } else if (step.status === 'cancelled' || step.status === 'expired') {
          Icon = AlertCircle;
          iconColor = 'text-status-neutral';
          bgColor = 'bg-status-neutral-bg';
          borderColor = 'border-status-neutral';
        }

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${bgColor} ${borderColor} ${iconColor} z-10 bg-background`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-2 text-center absolute top-12 w-32 -left-11">
                <p className="text-sm font-medium leading-none">{step.approverRole}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate" title={step.approverName}>
                  {step.approverName}
                </p>
                {step.decidedAt && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(step.decidedAt), 'MM/dd HH:mm')}
                  </p>
                )}
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={step.status} className="text-[10px] py-0 px-1 h-4" />
                </div>
              </div>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-border relative top-[-20px]">
                <div 
                  className={`absolute h-full ${step.status === 'approved' ? 'bg-status-success w-full' : 'w-0'}`} 
                  style={{ transition: 'width 0.5s ease' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
