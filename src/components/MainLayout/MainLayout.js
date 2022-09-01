import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SideBar from '../SideBar';
import BackgroundGradients from '../BackgroundGradients';
import { useAuth } from '../../contexts/AuthContext';
import PageLoadingBar from '../PageLoadingBar';
import useToast from '../../hooks/useToast';
import { LOCAL_STORAGE_KEYS } from '../../constants/enum';
import ConnectButton from '../ConnectButton';

function MainLayout({ children }) {
  const router = useRouter();
  const { toastInfo } = useToast();
  const { isCheckingAuth } = useAuth();

  const showHeader = router.pathname !== '/score/[address]';

  useEffect(() => {
    // Check Brave browser
    (async function checkBrave() {
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.CHECK_BRAVE)) return;
      if (navigator.brave && (await navigator.brave.isBrave())) {
        toastInfo(
          `You may experience some performance issues on Brave, please turn shields off for the best experience.`
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.CHECK_BRAVE, true);
      }
    })();
  }, []);

  return (
    <>
      <BackgroundGradients />
      {showHeader && (
        <nav>
          <SideBar />
        </nav>
      )}
      {isCheckingAuth ? <PageLoadingBar /> : children}

      <ConnectButton />
    </>
  );
}

export default MainLayout;
