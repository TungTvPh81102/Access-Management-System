import * as z from 'zod';
import { FieldConfig, FormSchema } from '@/types/form';

export function generateZodSchema(schema: FormSchema): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  schema.sections.forEach(section => {
    section.fields.forEach(field => {
      // If validation is explicitly provided, use it
      if (field.validation) {
        shape[field.name] = field.validation;
        return;
      }

      let fieldSchema: z.ZodTypeAny = z.any();

      switch (field.fieldType) {
        case 'text':
        case 'textarea':
        case 'signature':
        case 'file-upload':
        case 'image-upload':
          fieldSchema = z.string();
          break;
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'phone':
          fieldSchema = z.string().min(10, 'Phone number must be at least 10 digits');
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'date':
        case 'datetime':
        case 'time':
          fieldSchema = z.string();
          break;
        case 'select':
        case 'radio':
        case 'employee-picker':
        case 'department-picker':
        case 'company-picker':
        case 'asset-picker':
        case 'visitor-picker':
          fieldSchema = z.string();
          break;
        case 'multi-select':
        case 'checkbox':
          fieldSchema = z.array(z.string());
          break;
        case 'switch':
          fieldSchema = z.boolean();
          break;
        case 'date-range':
          fieldSchema = z.object({
            from: z.date(),
            to: z.date(),
          });
          break;
        case 'dynamic-table':
          if (field.subFields) {
            const subShape: Record<string, z.ZodTypeAny> = {};
            field.subFields.forEach(subField => {
              let subFieldSchema: z.ZodTypeAny = z.any();
              if (subField.fieldType === 'number') {
                 subFieldSchema = z.number();
              } else {
                 subFieldSchema = z.string();
              }
              if (subField.required) {
                if (subFieldSchema instanceof z.ZodString) {
                  subFieldSchema = subFieldSchema.min(1, 'Required');
                }
              } else {
                subFieldSchema = subFieldSchema.optional();
              }
              subShape[subField.name] = subFieldSchema;
            });
            fieldSchema = z.array(z.object(subShape)).min(1, 'At least one item is required');
          } else {
             fieldSchema = z.array(z.any());
          }
          break;
        default:
          fieldSchema = z.any();
      }

      if (field.required) {
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.min(1, 'Required');
        } else if (fieldSchema instanceof z.ZodArray) {
          fieldSchema = fieldSchema.min(1, 'At least one item must be selected');
        }
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''));
      }

      shape[field.name] = fieldSchema;
    });
  });

  return z.object(shape);
}
