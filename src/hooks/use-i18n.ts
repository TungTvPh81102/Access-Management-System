'use client';
import { useCallback } from 'react';
import { useI18nStore } from '@/stores/i18n-store';
import { translations } from '@/constants/i18n';

export function useI18n() {
  const { locale, setLocale } = useI18nStore();
  
  const t = useCallback((namespace: string, key: string, params?: Record<string, string | number>) => {
    const value = translations[locale]?.[namespace]?.[key] || key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
      value
    );
  }, [locale]);

  return { t, locale, setLocale };
}
