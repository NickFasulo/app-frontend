import '../../styles/global.css';
import MainLayout from '../components/MainLayout';
import createEmotionCache from '../createEmotionCache';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { queryClient } from '../config/react-query';
import Providers from '../providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Providers>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </Providers>
        </Hydrate>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default MyApp;
