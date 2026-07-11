'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/constants/i18n';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'gatepass-i18n' }
  )
);
