import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import scatter from '../eos/scatter/scatter.wallet';
import {
  fetchUserCollections,
  loginScatter,
  signalConnection,
  updateEthAuthInfo
} from '../redux/actions';
import { AUTH_TYPE, LOCAL_STORAGE_KEYS } from '../constants/enum';
import { logError } from '../utils/logging';
import {
  apiGetAccount,
  apiGetAccountByEthAddress,
  apiVerifyChallenge
} from '../apis';
import { accountConstants } from '../redux/constants';
import useToast from '../hooks/useToast';
import { useRouter } from 'next/router';

const AuthContext = createContext({
  isLoggedIn: false,
  isCheckingAuth: true,
  name: null,
  username: null,
  authInfo: {},
  updateAuthInfo: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toastError } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    (async function checkAuth() {
      // 1. Check auth through the extension.
      try {
        await scatter.detect(
          (scatter, account) => dispatch(loginScatter(scatter, account)),
          (isInstalled) => dispatch(signalConnection(isInstalled))
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
          const { eosname, signature, expiration } = await scatter.scatter.getAuthToken();
          const account = await apiGetAccount(eosname);

          setAuthInfo({
            authType: AUTH_TYPE.EXTENSION,
            eosname,
            username: account.username,
            address: account.ethInfo?.address,
            signature,
            expiration
          });
                
          const timer = setTimeout(() => refetchScatterAuth(), expiration - new Date().getTime() - 60000)
          return () => clearTimeout(timer)
        } catch (err) {
          logError('Scatter authentication failed.', err);
        }
      }

      // 2. Check auth through ETH
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

          // Update redux for eth auth.
          dispatch(
            updateEthAuthInfo({
              address,
              signature,
              account
            })
          );

          return;
        } catch (err) {
          logError('ETH authentication failed.', err);

          localStorage.removeItem(LOCAL_STORAGE_KEYS.ETH_AUTH);
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
      setIsCheckingAuth(false);
    })();
  }, []);
  

  useEffect(() => {
    if (!authInfo.eosname) return;
    // Store auth info into redux.
    dispatch({
      type: accountConstants.FETCH_AUTH_TOKEN_SUCCESS,
      ...authInfo
    });
    dispatch(fetchUserCollections(authInfo.eosname));

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
  console.log("REFETCHING")
  const { eosname, signature, expiration } = await scatter.scatter.getAuthToken();
  const account = await apiGetAccount(eosname);
  const authInfo = {
    authType: AUTH_TYPE.EXTENSION,
    eosname,
    username: account.username,
    address: account.ethInfo?.address,
    signature,
    expiration}
  setAuthInfo(authInfo);
  return authInfo
 }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isCheckingAuth,
        name: authInfo.eosname,
        username: authInfo.username,
        authInfo,
        updateAuthInfo: setAuthInfo,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
