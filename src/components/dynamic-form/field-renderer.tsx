'use client';
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EntityPickerDialog } from './entity-picker-dialog';
import type { FieldConfig } from '@/types/form';
import { useI18n } from '@/hooks/use-i18n';

interface FieldRendererProps {
  field: FieldConfig;
}

export function FieldRenderer({ field }: FieldRendererProps) {
  const { control } = useFormContext(); // Need to fix import below
  const { t } = useI18n();

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
        return (
          <div className="flex flex-col space-y-2">
            <Label className={error ? 'text-destructive' : ''}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            
            <FieldInput 
              config={field} 
              value={value} 
              onChange={onChange} 
              onBlur={onBlur} 
              error={!!error}
            />

            {field.description && (
              <p className="text-[0.8rem] text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-[0.8rem] font-medium text-destructive">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

function FieldInput({ 
  config, 
  value, 
  onChange, 
  onBlur,
  error
}: { 
  config: FieldConfig; 
  value: unknown; 
  onChange: (val: unknown) => void;
  onBlur: () => void;
  error: boolean;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const { t } = useI18n();

  switch (config.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
    case 'time':
      return (
        <Input
          type={config.fieldType === 'number' ? 'number' : config.fieldType === 'time' ? 'time' : 'text'}
          placeholder={config.placeholder}
          value={value || ''}
          onChange={(e) => {
             const val = config.fieldType === 'number' ? parseFloat(e.target.value) : e.target.value;
             onChange(val);
          }}
          onBlur={onBlur}
          readOnly={config.readonly}
          className={error ? 'border-destructive' : ''}
        />
      );
    case 'textarea':
      return (
        <Textarea
          placeholder={config.placeholder}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={config.readonly}
          className={error ? 'border-destructive' : ''}
        />
      );
    case 'select':
      return (
        <Select value={(value as string) || ''} onValueChange={onChange} disabled={config.readonly}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={config.placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(config.options) && config.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'radio':
      return (
        <RadioGroup value={(value as string) || ''} onValueChange={onChange} disabled={config.readonly} className="flex flex-col space-y-1 mt-2">
          {Array.isArray(config.options) && config.options.map(opt => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`${config.name}-${opt.value}`} />
              <Label htmlFor={`${config.name}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'checkbox':
      const isArr = Array.isArray(value);
      const vals = isArr ? (value as string[]) : [];
      return (
        <div className="flex flex-col space-y-2 mt-2">
          {Array.isArray(config.options) && config.options.map(opt => (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`${config.name}-${opt.value}`} 
                checked={vals.includes(opt.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...vals, opt.value]);
                  } else {
                    onChange(vals.filter((v: string) => v !== opt.value));
                  }
                }}
                disabled={config.readonly}
              />
              <Label htmlFor={`${config.name}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2 py-2">
          <Switch 
            checked={!!value} 
            onCheckedChange={onChange} 
            disabled={config.readonly} 
          />
        </div>
      );
    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                error && "border-destructive"
              )}
              disabled={config.readonly}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value as string), "PPP") : <span>{config.placeholder || "Pick a date"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value as string) : undefined}
              onSelect={(date) => onChange(date ? date.toISOString() : '')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case 'employee-picker':
    case 'department-picker':
    case 'company-picker':
    case 'asset-picker':
    case 'visitor-picker':
      const entityType = config.fieldType.replace('-picker', '') as any;
      return (
        <div className="flex items-center space-x-2">
          <Input 
            value={(value as string) || ''} 
            readOnly 
            placeholder={config.placeholder || `Select ${entityType}`}
            className={cn("flex-1", error && "border-destructive")}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => setPickerOpen(true)}
            disabled={config.readonly}
          >
            <Search className="h-4 w-4" />
          </Button>
          <EntityPickerDialog 
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            entityType={entityType}
            onSelect={(entity: Record<string, unknown>) => {
              if (entityType === 'employee') onChange(entity.name);
              else if (entityType === 'department') onChange(entity.name);
              else onChange(entity.name || entity.id);
            }}
          />
        </div>
      );
    case 'file-upload':
    case 'image-upload':
      return (
        <Input 
          type="file" 
          onChange={(e) => {
             if (e.target.files && e.target.files.length > 0) {
               onChange(e.target.files[0].name); // mock file upload
             }
          }} 
          disabled={config.readonly}
          accept={config.fieldType === 'image-upload' ? 'image/*' : undefined}
        />
      );
    case 'dynamic-table':
      return (
        <div className="border rounded-md p-4 bg-muted/20 text-sm text-center">
          [Dynamic Table Placeholder: {config.name}]
        </div>
      );
    case 'signature':
      return (
        <div className="border rounded-md h-32 flex items-center justify-center bg-muted/10">
          <span className="text-muted-foreground text-sm">Sign Here (Mock)</span>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="absolute"
            onClick={() => onChange('signed-mock-data')}
          >
            Apply Mock Signature
          </Button>
        </div>
      );
    default:
      return <Input value={(value as string) || ''} onChange={e => onChange(e.target.value)} onBlur={onBlur} disabled={config.readonly} />;
  }
}
