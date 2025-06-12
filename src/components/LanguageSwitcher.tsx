'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12h20M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0M12 2a10 10 0 0 0-8 8m0 4a10 10 0 0 0 8 8" />
      </svg>
      <span>{t('menu.language')}</span>
      <span className="ml-auto text-xs font-medium">
        {i18n.language === 'en' ? '中文' : 'English'}
      </span>
    </button>
  );
} 