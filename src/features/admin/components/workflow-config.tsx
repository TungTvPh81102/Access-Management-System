'use client';
import * as React from 'react';
import { Plus, Trash2, Save, Users, Building, ShieldCheck, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

import { useWorkflowTemplates, useUpdateWorkflowTemplate } from '@/features/admin/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { REGISTRATION_TYPES } from '@/constants';
import type { WorkflowTemplateStep, WorkflowTemplate } from '@/types';
import { useEmployees } from '@/hooks/use-entity-data';

export function WorkflowConfig() {
  const { data: templates, isLoading } = useWorkflowTemplates();
  const updateMut = useUpdateWorkflowTemplate();
  const { data: employees } = useEmployees();
  
  const [selectedType, setSelectedType] = React.useState<string>(REGISTRATION_TYPES[0].type);
  const [steps, setSteps] = React.useState<WorkflowTemplateStep[]>([]);
  const [templateId, setTemplateId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (templates) {
      const template = templates.find(t => t.registrationType === selectedType);
      if (template) {
        setTemplateId(template.id);
        // deep copy
        setSteps(JSON.parse(JSON.stringify(template.steps)));
      }
    }
  }, [templates, selectedType]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        id: Math.random().toString(),
        stepNumber: steps.length + 1,
        roleId: 'manager',
        departmentId: 'APPLICANT_DEPT',
        description: 'New Approval Step',
      }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(newSteps);
  };

  const handleUpdateStep = (index: number, field: keyof WorkflowTemplateStep, value: string | undefined) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    // clear specific userId if switching to role based
    if (field === 'roleId' || field === 'departmentId') {
      newSteps[index].specificUserId = undefined;
    }
    // clear role/dept if specific user is selected
    if (field === 'specificUserId') {
      newSteps[index].roleId = undefined;
      newSteps[index].departmentId = undefined;
    }
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (!templateId) return;
    updateMut.mutate(
      { id: templateId, steps },
      {
        onSuccess: () => toast.success('Workflow template updated successfully'),
        onError: () => toast.error('Failed to update workflow template'),
      }
    );
  };

  if (isLoading) {
    return <div className="space-y-4 p-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[500px] w-full" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflow & Role Configuration</h1>
        <p className="text-muted-foreground">Define approval steps and assign roles/members for each service.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Service</CardTitle>
          <CardDescription>Choose a registration type to configure its approval workflow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-[300px]">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service..." />
              </SelectTrigger>
              <SelectContent>
                {REGISTRATION_TYPES.map(rt => (
                  <SelectItem key={rt.type} value={rt.type}>{rt.labelKey}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Approval Steps</h2>
          <Button onClick={handleAddStep} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>

        {steps.length === 0 ? (
          <div className="p-8 text-center border rounded-md border-dashed text-muted-foreground">
            No approval steps defined. Requests will be automatically approved or require manual admin intervention.
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <Card>
                  <CardHeader className="py-4 flex flex-row items-center justify-between bg-muted/20 border-b">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                        {step.stepNumber}
                      </div>
                      <Input 
                        value={step.description}
                        onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                        className="font-medium bg-transparent border-none focus-visible:ring-1 h-8 w-64"
                        placeholder="Step Description..."
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveStep(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>Assign Generic Role</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select 
                            value={step.roleId || 'none'} 
                            onValueChange={(val) => handleUpdateStep(index, 'roleId', val === 'none' ? undefined : val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Role..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- Select Role --</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="admin">System Admin</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select 
                            value={step.departmentId || 'none'} 
                            onValueChange={(val) => handleUpdateStep(index, 'departmentId', val === 'none' ? undefined : val)}
                            disabled={!step.roleId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Department..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- Select Dept --</SelectItem>
                              <SelectItem value="APPLICANT_DEPT">Applicant&apos;s Dept</SelectItem>
                              <SelectItem value="HR">HR Dept</SelectItem>
                              <SelectItem value="IT">IT Dept</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>OR Assign Specific Person</span>
                        </Label>
                        <Select 
                          value={step.specificUserId || 'none'}
                          onValueChange={(val) => handleUpdateStep(index, 'specificUserId', val === 'none' ? undefined : val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specific employee..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-- Leave unassigned --</SelectItem>
                            {employees?.map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.department})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-8 z-10 text-muted-foreground">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={updateMut.isPending} size="lg">
          <ShieldCheck className="h-4 w-4 mr-2" />
          {updateMut.isPending ? 'Saving...' : 'Save Workflow Template'}
        </Button>
      </div>
    </div>
  );
}
