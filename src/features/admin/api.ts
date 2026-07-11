'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/endpoints';
import type { WorkflowTemplateStep } from '@/types';

export const adminKeys = {
  all: ['admin'] as const,
  workflowTemplates: () => [...adminKeys.all, 'workflowTemplates'] as const,
};

export function useWorkflowTemplates() {
  return useQuery({
    queryKey: adminKeys.workflowTemplates(),
    queryFn: () => api.fetchWorkflowTemplates(),
  });
}

export function useUpdateWorkflowTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, steps }: { id: string; steps: WorkflowTemplateStep[] }) => api.updateWorkflowTemplate(id, steps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.workflowTemplates() });
    },
  });
}
