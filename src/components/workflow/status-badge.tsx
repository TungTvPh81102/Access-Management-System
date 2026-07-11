import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS } from '@/constants';
import type { RequestStatus } from '@/types';
import { useI18n } from '@/hooks/use-i18n';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useI18n();
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;

  return (
    <Badge 
      variant="secondary"
      className={cn(colors.bg, colors.text, colors.border, "font-medium border rounded-sm px-2 py-0.5 whitespace-nowrap", className)}
    >
      {t('common', status)}
    </Badge>
  );
}
