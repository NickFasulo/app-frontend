import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useRouter } from 'next/router';
import scatter from '../eos/scatter/scatter.wallet';
import { AUTH_TYPE, LOCAL_STORAGE_KEYS } from '../constants/enum';
import { logError } from '../utils/logging';
import {
  apiGetAccount,
  apiGetAccountByEthAddress,
  apiVerifyChallenge
} from '../apis';
import useToast from '../hooks/useToast';

const AuthContext = createContext({
  isLoggedIn: false,
  isCheckingAuth: true,
  name: null,
  username: null,
  authInfo: {},
  updateAuthInfo: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const { toastError } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    (async function checkAuth() {
      // 1. Check auth through ETH
      const ethAuthInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.ETH_AUTH);

      if (ethAuthInfo) {
        try {
          const { address, signature } = JSON.parse(ethAuthInfo);

          // Check if signature is valid
          await apiVerifyChallenge(address, signature);

          // Get ETH account info
          const account = await apiGetAccountByEthAddress(address);

          setAuthInfo({
            authType: AUTH_TYPE.ETH,
            eosname: account._id,
            username: account.username,
            address,
            signature
          });

          return;
        } catch (err) {
          logError('ETH authentication failed.', err);

          localStorage.removeItem(LOCAL_STORAGE_KEYS.ETH_AUTH);
        }
      }

      // If user's not signed-in with ETH, tries checking auth async because checking through extension takes a lot of time.
      setIsCheckingAuth(false);

      // 2. Check auth through the extension.
      try {
        await scatter.detect(
          () => {},
          () => {}
        );
      } catch (err) {
        if (err.message === 'TWO_SCATTERS_INSTALLED') {
          toastError(
            'Both Scatter Desktop and Extension are installed. Close or uninstall one to continue'
          );
        }
      }

      if (scatter.connected) {
        try {
          const { eosname, signature, expiration } =
            await scatter.scatter.getAuthToken();
          const account = await apiGetAccount(eosname);

          setAuthInfo({
            authType: AUTH_TYPE.EXTENSION,
            eosname,
            username: account.username,
            address: account.ethInfo?.address,
            signature,
            expiration
          });

          const timer = setTimeout(
            () => refetchScatterAuth(),
            expiration - new Date().getTime() - 60000
          );
          return () => clearTimeout(timer);
        } catch (err) {
          logError('Scatter authentication failed.', err);
        }
      }

      // 3. Check auth through Twitter
      const twitterAuthInfo = localStorage.getItem(
        LOCAL_STORAGE_KEYS.TWITTER_INFO
      );

      if (twitterAuthInfo) {
        try {
          const { expiration, name, token } = JSON.parse(twitterAuthInfo);
          const account = await apiGetAccount(name);

          if (expiration && expiration > Date.now()) {
            setAuthInfo({
              authType: AUTH_TYPE.TWITTER,
              eosname: name,
              username: account.username,
              address: account.ethInfo?.address,
              oauthToken: token
            });

            return;
          }
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TWITTER_INFO);
        } catch (err) {
          logError('Twitter authentication failed.', err);
        }
      }

      // Set not-authenticated
      setIsLoggedIn(false);
    })();
  }, []);

  useEffect(() => {
    if (!authInfo.eosname) return;

    // Set as authenticated
    setIsLoggedIn(true);
    setIsCheckingAuth(false);
  }, [authInfo]);

  useEffect(() => {
    // Only show loading bar on home page.
    if (router.pathname !== '/') {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setAuthInfo({});
  }, []);

  const refetchScatterAuth = async () => {
    console.log('REFETCHING');
    const { eosname, signature, expiration } =
      await scatter.scatter.getAuthToken();
    const account = await apiGetAccount(eosname);
    const authInfo = {
      authType: AUTH_TYPE.EXTENSION,
      eosname,
      username: account.username,
      address: account.ethInfo?.address,
      signature,
      expiration
    };
    setAuthInfo(authInfo);
    return authInfo;
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isCheckingAuth,
        name: authInfo.eosname,
        username: authInfo.username,
        userId: authInfo.eosname,
        authInfo,
        updateAuthInfo: setAuthInfo,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
