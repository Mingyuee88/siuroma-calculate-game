import './globals.css';
import '@/styles/fonts.css';
import type { Metadata } from 'next';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Math Game',
  description: 'A fun math game for kids',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/GenSenRounded/GenSenRounded2TC-R.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GenSenRounded/GenSenRounded2TC-M.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GenSenRounded/GenSenRounded2TC-B.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Fredoka/Fredoka-VariableFont_wdth,wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
