'use client';
import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { FormSchema, FieldConfig, FormValues } from '@/types/form';
import { generateZodSchema } from './schema-to-zod';
import { FieldRenderer } from './field-renderer';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';

interface DynamicFormRendererProps {
  schema: FormSchema;
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function DynamicFormRenderer({
  schema,
  defaultValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DynamicFormRendererProps) {
  const { t } = useI18n();
  const zodSchema = React.useMemo(() => generateZodSchema(schema), [schema]);
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  const { handleSubmit, watch } = methods;
  const watchAll = watch();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {schema.sections.map((section, idx) => {
          // Check if any field in section is visible
          const hasVisibleFields = section.fields.some(field => {
            if (typeof field.hidden === 'function') {
              return !field.hidden(watchAll);
            }
            return !field.hidden;
          });

          if (!hasVisibleFields) return null;

          const SectionContent = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.fields.map(field => {
                const isHidden = typeof field.hidden === 'function' ? field.hidden(watchAll) : field.hidden;
                if (isHidden) return null;
                
                const spanClass = field.gridSpan === 4 ? 'col-span-1 md:col-span-2 lg:col-span-4' :
                                  field.gridSpan === 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' :
                                  field.gridSpan === 2 ? 'col-span-1 md:col-span-2 lg:col-span-2' :
                                  'col-span-1';

                return (
                  <div key={field.name} className={spanClass}>
                    <FieldRenderer field={field} />
                  </div>
                );
              })}
            </div>
          );

          if (section.collapsible) {
            return (
              <Card key={idx}>
                <Collapsible defaultOpen={!section.defaultCollapsed}>
                  <CardHeader className="p-4 border-b">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                      <ChevronDown className="h-5 w-5" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-6">
                      {SectionContent}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          }

          return (
            <Card key={idx}>
              <CardHeader className="p-4 border-b bg-muted/20">
                <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {SectionContent}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end space-x-4 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('common', 'cancel')}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common', 'loading') : t('common', 'submit')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
