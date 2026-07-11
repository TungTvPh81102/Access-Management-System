'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { DynamicFormRenderer } from '@/components/dynamic-form/dynamic-form-renderer';
import { visitorSchema } from '@/features/registrations/schemas/visitor';
import { useCreateRegistration } from '@/features/registrations/api';
import { Button } from '@/components/ui/button';

export function VisitorForm() {
  const router = useRouter();
  const createMutation = useCreateRegistration();

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(
      { type: 'visitor', data },
      {
        onSuccess: (res) => {
          toast.success('Visitor request created successfully');
          router.push(`/registrations/visitor/${res.id}`);
        },
        onError: () => {
          toast.error('Failed to create request');
        },
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Visitor Request</h1>
          <p className="text-muted-foreground">Fill in the details for the new visitor.</p>
        </div>
      </div>

      <DynamicFormRenderer
        schema={visitorSchema}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
