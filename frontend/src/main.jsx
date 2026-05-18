import { StrictMode, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './i18n';
import './index.css';
import App from './App.jsx';
import { useThemeStore, applyThemeToDocument } from './store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/** Keeps `document.documentElement` in sync with Zustand (fixes admin toggle + persist hydration). */
function ThemeSync() {
  const mode = useThemeStore((s) => s.mode);
  useLayoutEffect(() => {
    applyThemeToDocument(mode);
  }, [mode]);
  useLayoutEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      applyThemeToDocument(useThemeStore.getState().mode);
    });
    applyThemeToDocument(useThemeStore.getState().mode);
    return () => {
      unsub?.();
    };
  }, []);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeSync />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1C1C1C',
                color: '#F7F4EF',
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
