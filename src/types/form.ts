import { ZodTypeAny } from 'zod';

export type FieldType =
  | 'text' | 'number' | 'email' | 'phone' | 'textarea'
  | 'select' | 'multi-select' | 'radio' | 'checkbox' | 'switch'
  | 'date' | 'datetime' | 'time' | 'date-range'
  | 'file-upload' | 'image-upload' | 'signature'
  | 'employee-picker' | 'department-picker' | 'company-picker'
  | 'asset-picker' | 'visitor-picker'
  | 'dynamic-table' | 'repeatable-section' | 'nested-group';

export interface SelectOption {
  label: string;
  value: string;
}

export type FormValues = Record<string, unknown>;

export interface FieldConfig {
  name: string;
  fieldType: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean | ((values: FormValues) => boolean);
  validation?: ZodTypeAny;
  options?: SelectOption[] | (() => Promise<SelectOption[]>);
  multiple?: boolean;
  apiEndpoint?: string;
  dependsOn?: string[];
  gridSpan?: 1 | 2 | 3 | 4;
  defaultValue?: unknown;
  description?: string;
  // For dynamic-table field type
  subFields?: FieldConfig[];
  // For picker fields
  entityType?: 'employee' | 'department' | 'company' | 'asset' | 'visitor';
}

export interface FormSection {
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FieldConfig[];
}

export interface FormSchema {
  registrationType: string;
  sections: FormSection[];
}
