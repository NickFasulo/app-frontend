import '../../styles/global.css';
import MainLayout from '../components/MainLayout';
import createEmotionCache from '../createEmotionCache';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { QueryClientProvider } from 'react-query';
import { useEffect, useState } from 'react';
import { queryClient } from '../config/react-query';
import Providers from '../providers';

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
        <Providers>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </Providers>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default MyApp;
