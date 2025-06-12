'use client';

import { PropsWithChildren, useEffect } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions } from '@/i18n/settings';

// Initialize i18next outside of the component
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`../../public/locales/${language}/${namespace}.json`);
    })
  )
  .init({
    ...getOptions(),
    lng: 'zh-TW', // set Traditional Chinese as default
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  });

export function I18nProvider({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
} 