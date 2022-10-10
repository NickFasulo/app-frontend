import '../../styles/global.css';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { queryClient } from '../config/react-query';
import Providers from '../providers';
import createEmotionCache from '../createEmotionCache';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../contexts/AuthContext';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) {
  const account = useAuth();
  const { isLoggedIn, userId, authInfo } = account;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (userId) {
      LogRocket.identify(userId, {
        name: authInfo.username
      });
    }
  },
    [userId]);

  if (!isMounted) {
    return null;
  }
  // only initialize when in the browser
  if (typeof window !== 'undefined') {
    LogRocket.init('rohogp/yup');
    // plugins should also only be initialized when in the browser
    setupLogRocketReact(LogRocket);
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
}

export default MyApp;
