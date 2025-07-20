"use client";

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import useAppStore from '../stores/useAppStore';
import './globals.css';

/**
 * Root layout component with theme provider
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Root layout
 */
export default function RootLayout({ children }) {
  const theme = useAppStore((state) => state.theme);
  const initializeAuth = useAppStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}