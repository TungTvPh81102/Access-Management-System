'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/endpoints';
import type { RegistrationType, QueryParams } from '@/types';

export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  list: (type: RegistrationType, params: QueryParams) => [...registrationKeys.lists(), type, params] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationKeys.details(), id] as const,
};

export function useRegistrations(type: RegistrationType, params: QueryParams) {
  return useQuery({
    queryKey: registrationKeys.list(type, params),
    queryFn: () => api.fetchRegistrations(type, params),
  });
}

export function useRegistration(id: string) {
  return useQuery({
    queryKey: registrationKeys.detail(id),
    queryFn: () => api.fetchRegistrationById(id),
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, data }: { type: RegistrationType; data: Record<string, unknown> }) =>
      api.createRegistration(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() });
    },
  });
}

export function useApproveRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => api.approveRegistration(id, comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() });
    },
  });
}

export function useRejectRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.rejectRegistration(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => api.addRegistrationComment(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.detail(variables.id) });
    },
  });
}
