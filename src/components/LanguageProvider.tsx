'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return <>{children}</>;
} 