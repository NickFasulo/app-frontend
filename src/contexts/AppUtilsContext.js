import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import PageLoadingBar from '../components/PageLoadingBar';
import { useRouter } from 'next/router';

const AppUtilsContext = createContext({
  windowScrolled: false,
  showTopBar: () => {}
});

export const AppUtilsProvider = ({ children }) => {
  const { asPath } = useRouter();
  const [windowScrolled, setWindowScrolled] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setWindowScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  useEffect(() => {
    setTopBarVisible(false);
  }, [asPath]);

  const showTopBar = useCallback(() => {
    setTopBarVisible(true);
  }, []);

  return (
    <AppUtilsContext.Provider
      value={{
        windowScrolled,
        showTopBar
      }}
    >
      {topBarVisible && (
        <PageLoadingBar />
      )}
      {children}
    </AppUtilsContext.Provider>
  );
};

export const useAppUtils = () => useContext(AppUtilsContext);

export default AppUtilsContext;
