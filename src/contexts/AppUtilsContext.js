import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/styles';
import PageLoadingBar from '../components/PageLoadingBar';

const AppUtilsContext = createContext({
  windowScrolled: false,
  showTopBar: () => {}
});

export const AppUtilsProvider = ({ children }) => {
  const { asPath } = useRouter();
  const theme = useTheme();
  const [windowScrolled, setWindowScrolled] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      const isScrolled = window.scrollY > 0;
      const headerElem = document.getElementsByClassName('page-header')?.[0];

      if (headerElem) {
        headerElem.style.backgroundColor = isScrolled
          ? `${theme.palette.M850}20`
          : 'transparent';
        headerElem.style.backdropFilter = isScrolled ? 'blur(12px)' : 'none';
      }

      setWindowScrolled(isScrolled);
    };

    scrollListener();

    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, [theme]);

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
      {topBarVisible && <PageLoadingBar />}
      {children}
    </AppUtilsContext.Provider>
  );
};

export const useAppUtils = () => useContext(AppUtilsContext);

export default AppUtilsContext;
