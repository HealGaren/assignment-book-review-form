import type { AppProps } from 'next/app';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createEmotionCache } from '@/lib/emotionCache';
import { theme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { bookFormSchema, type BookFormValues } from '@/features/book-form/schema';

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

const defaultValues: BookFormValues = {
  title: '',
  author: '',
  totalPages: 0,
  publishDate: '',
  readingStatus: 'want-to-read',
  startDate: '',
  endDate: '',
  recommended: false,
  rating: 0,
  review: '',
  quotes: [],
  isPublic: false,
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const methods = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  });

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <FormProvider {...methods}>
            <Component {...pageProps} />
          </FormProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}
