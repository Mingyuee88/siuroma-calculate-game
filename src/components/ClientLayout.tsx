'use client';

import { I18nProvider } from './I18nProvider';
import { LanguageProvider } from './LanguageProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </I18nProvider>
  );
} 