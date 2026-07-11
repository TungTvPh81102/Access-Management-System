import type { FormSchema } from '@/types/form';

export const visitorSchema: FormSchema = {
  registrationType: 'visitor',
  sections: [
    {
      title: 'Visitor Information',
      fields: [
        {
          name: 'visitorName',
          fieldType: 'text',
          label: 'Visitor Name',
          placeholder: 'John Doe',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'visitorCompany',
          fieldType: 'company-picker',
          label: 'Company',
          placeholder: 'Select Company',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'idNumber',
          fieldType: 'text',
          label: 'ID / Passport Number',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'phone',
          fieldType: 'phone',
          label: 'Phone Number',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'email',
          fieldType: 'email',
          label: 'Email Address',
          required: false,
          gridSpan: 2,
        },
        {
          name: 'vehiclePlate',
          fieldType: 'text',
          label: 'Vehicle Plate (if driving)',
          required: false,
          gridSpan: 2,
        },
      ]
    },
    {
      title: 'Visit Details',
      fields: [
        {
          name: 'purpose',
          fieldType: 'select',
          label: 'Purpose of Visit',
          required: true,
          gridSpan: 2,
          options: [
            { label: 'Meeting', value: 'Meeting' },
            { label: 'Interview', value: 'Interview' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Delivery', value: 'Delivery' },
            { label: 'Other', value: 'Other' },
          ]
        },
        {
          name: 'hostName',
          fieldType: 'employee-picker',
          label: 'Host / Point of Contact',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'visitDate',
          fieldType: 'date',
          label: 'Date of Visit',
          required: true,
          gridSpan: 2,
        },
        {
          name: 'timeFrame',
          fieldType: 'time',
          label: 'Expected Arrival Time',
          required: false,
          gridSpan: 2,
        }
      ]
    },
    {
      title: 'Additional Options',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'needsWifi',
          fieldType: 'switch',
          label: 'Request Guest Wi-Fi Access',
          gridSpan: 4,
        },
        {
          name: 'needsLunch',
          fieldType: 'switch',
          label: 'Company Lunch Provided',
          gridSpan: 4,
        }
      ]
    }
  ]
};
