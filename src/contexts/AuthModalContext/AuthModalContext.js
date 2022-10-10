import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Hidden,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { AUTH_TYPE, LOCAL_STORAGE_KEYS } from '../../constants/enum';
import {
  apiCheckWhitelist,
  apiGetAccountByEthAddress,
  apiGetChallenge,
  apiGetOAuthChallenge,
  apiGetTwitterAuthInfo,
  apiInviteEmail,
  apiMirrorAccount,
  apiRequestWhitelist,
  apiSetETHAddress,
  apiValidateUsername,
  apiVerifyChallenge
} from '../../apis';
import {
  ERROR_CONNECT_WALLET_TRY_AGAIN,
  ERROR_EMPTY_USERNAME,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_USERNAME,
  ERROR_MIRROR_ACCOUNT,
  ERROR_SIGN_FAILED,
  ERROR_TWITTER_AUTH,
  ERROR_WALLET_NOT_CONNECTED,
  INVITE_EMAIL_SUCCESS,
  WAIT_FOR_ACCOUNT_CREATION,
  ACCOUNT_CREATED
} from '../../constants/messages';
import {
  ANALYTICS_SIGN_UP_TYPES,
  trackLogin,
  trackSignUp,
  trackSignUpAttempt,
  trackWhitelist
} from '../../utils/analytics';
import { isValidEmail } from '../../utils/helpers';
import AuthMethodButton from '../../components/AuthMethodButton';
import AuthInput from '../../components/AuthInput/AuthInput';
import useStyles from './AuthModalStyles';
import useToast from '../../hooks/useToast';
import { YupDialog } from '../../components/Miscellaneous';
import { useAuth } from '../AuthContext';
import { useYupAccount } from '../../hooks/queries';

const defaultContext = {
  open: () => { },
  startEthAuth: () => { }
};

const AuthModalContext = React.createContext(defaultContext);

const AUTH_MODAL_STAGE = {
  SIGN_IN: 'SIGN_IN',
  REQUIRE_EMAIL: 'REQUIRE_EMAIL',
  REQUIRE_USERNAME: 'REQUIRE_USERNAME'
};

export const AuthModalContextProvider = ({ children }) => {
  const classes = useStyles();
  const { authInfo, updateAuthInfo, userId, isLoggedIn } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: signature, isSuccess, signMessage } = useSignMessage();
  const router = useRouter();
  const { data: account } = useYupAccount(userId);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [stage, setStage] = useState(AUTH_MODAL_STAGE.SIGN_IN);
  const [email, setEmail] = useState('');
  const [ethSignData, setEthSignData] = useState(null);
  const [username, setUsername] = useState('');
  const [linkEth, setLinkEth] = useState(false);
  const [currAuthMethod, setCurrAuthMethod] = useState(null);

  useEffect(() => {
    // If `Connect Wallet` button is clicked and wallet is connect, start auth with ETH.
    if (isConnected) {
      if (currAuthMethod === AUTH_TYPE.ETH || linkEth) {
        getSignature();
      }
    }
  }, [isConnected, currAuthMethod, linkEth]);

  useEffect(() => {
    if (!isLoggedIn) {
      disconnect();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // If `Connect Wallet` button is clicked and wallet is connect, start auth with ETH.
    if (signature && isSuccess) {
      if (currAuthMethod === AUTH_TYPE.ETH) {
        setCurrAuthMethod(null);
        handleAuthWithWallet();
      } else if (linkEth) {
        setLinkEth(null);
        handleLinkEthAddress();
      }
    }
  }, [signature]);

  const handleCloseModal = () => {
    console.log('CLOSING');
    setModalOpen(false);
    setOptions({});
  };

  const handleOpenModal = useCallback((_options = {}) => {
    setOptions(_options);
    setModalOpen(true);
  }, []);

  const handleStartEthAuth = useCallback((_options = {}) => {
    setOptions(_options);
    setCurrAuthMethod(AUTH_TYPE.ETH);
  }, []);

  const handleStartLinkEthAddress = useCallback((_options = {}) => {
    setOptions(_options);
    setLinkEth(true);
  }, []);

  const getSignature = async () => {
    try {
      const rspChallenge = await apiGetChallenge({ address });
      signMessage({ message: rspChallenge.data });
    } catch (err) {
      // Failed to sign the challenge, should try again.
      // Most cases are when the user rejects to sign.
      toastError(err.message || ERROR_SIGN_FAILED);
    }
  };
  const handleAuthWithWallet = async () => {
    if (!signature) {
      toastError(ERROR_SIGN_FAILED);

      disconnect();

      return;
    }

    // Save signature data for later use.
    setEthSignData({ address, signature });

    try {
      await apiVerifyChallenge(address, signature);
    } catch (err) {
      if (err?.response?.status === 401) {
        // If account is not found, request username for Sign-Up.
        setStage(AUTH_MODAL_STAGE.REQUIRE_USERNAME);
      } else {
        // Verification failed, should try again.
        toastError(ERROR_CONNECT_WALLET_TRY_AGAIN);
      }

      return;
    }

    // Store challenge/signature into localStorage for later use.
    const ethAuth = {
      address,
      signature
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.ETH_AUTH, JSON.stringify(ethAuth));

    // Check if account is already claimed
    let account;
    try {
      account = await apiGetAccountByEthAddress(address);
    } catch {
      // Check if the address is whitelisted
      try {
        await apiCheckWhitelist(address);

        // ETH address is whitelisted.
        // Then require user to enter a unique username to finish Sign-Up process.
        setStage(AUTH_MODAL_STAGE.REQUIRE_USERNAME);
      } catch {
        // ETH address is not whitelisted.
        // Then require user to enter an email to be notified when the address is whitelisted.
        setStage(AUTH_MODAL_STAGE.REQUIRE_EMAIL);
      }

      return;
    }

    updateAuthInfo({
      authType: AUTH_TYPE.ETH,
      address,
      signature,
      eosname: account._id,
      username: account.username
    });

    // Tract for analytics
    trackLogin(account.username, address);

    // Close modal
    handleCloseModal();

    if (!options.noRedirect) {
      // Redirect to profile page
      router.push(`/account/${account.username}`);
    }
  };
  const handleLinkEthAddress = async () => {
    if (!signature) {
      toastError(ERROR_SIGN_FAILED);

      disconnect();

      return;
    }

    // This currently has no effect, need to update when we have new auth system

    // try {
    //   await apiVerifyChallenge(address, signature);
    // } catch (err) {
    //   // Verification failed, should try again.
    //   toastError(ERROR_CONNECT_WALLET_TRY_AGAIN);
    //   return;
    // }

    try {
      await apiSetETHAddress(address, {
        eosname: account._id,
        signature: authInfo.signature,
        authType: authInfo.authType,
        ethSignature: signature
      });
    } catch (err) {
      toastError(ERROR_CONNECT_WALLET_TRY_AGAIN);

      return;
    }
    // Save signature data for later use.

    // Store challenge/signature into localStorage for later use.
    const ethAuth = {
      address,
      signature
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.ETH_AUTH, JSON.stringify(ethAuth));

    // Tract for analytics
    trackLogin(account.username, address);

    // Close modal
    handleCloseModal();

    if (!options.noRedirect) {
      // Redirect to profile page
      router.push(`/account/${account.username}`);
    }
  };
  const handleAuthWithTwitter = async () => {
    try {
      const { token, _id: id } = await apiGetOAuthChallenge();
      const { redirectPath } = await apiGetTwitterAuthInfo(
        token,
        id,
        'website'
      );

      trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.TWITTER, id);

      window.location.href = redirectPath;
    } catch {
      toastError(ERROR_TWITTER_AUTH);
    }
  };

  const handleSignUpWithEmail = async () => {
    if (!isValidEmail(email)) {
      toastError(ERROR_INVALID_EMAIL);

      return;
    }

    await apiInviteEmail(email);

    // Show success notification
    toastSuccess(INVITE_EMAIL_SUCCESS);

    trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.EMAIL, email);

    // Close Modal
    handleCloseModal();
  };

  const handleRequestWhitelist = async () => {
    if (!isValidEmail(email)) {
      toastError(ERROR_INVALID_EMAIL);

      return;
    }

    if (!ethSignData) {
      // This error should not happen at all.
      toastError(ERROR_WALLET_NOT_CONNECTED);

      return;
    }

    try {
      await apiRequestWhitelist(
        ethSignData.address,
        ethSignData.signature,
        email
      );

      trackWhitelist(ethSignData.address, email);

      toastSuccess(INVITE_EMAIL_SUCCESS);

      // Close modal
      handleCloseModal();
    } catch {
      toastError(ERROR_CONNECT_WALLET_TRY_AGAIN);
    }
  };

  const handleETHSignUp = async () => {
    if (!username) {
      toastError(ERROR_EMPTY_USERNAME);

      return;
    }

    try {
      await apiValidateUsername(username);
    } catch (err) {
      console.log({ err });
      toastError(err?.response?.data?.message || ERROR_INVALID_USERNAME);

      return;
    }

    toastSuccess(WAIT_FOR_ACCOUNT_CREATION);

    let mirrorData;

    try {
      mirrorData = await apiMirrorAccount(
        ethSignData.address,
        ethSignData.signature,
        username
      );
    } catch (err) {
      toastError(err?.response?.data?.message || ERROR_MIRROR_ACCOUNT);

      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.ETH_AUTH,
      JSON.stringify({
        ...ethSignData,
        ...mirrorData
      })
    );

    updateAuthInfo({
      authType: AUTH_TYPE.ETH,
      ...ethSignData,
      eosname: mirrorData.account._id,
      username: mirrorData.account.username
    });

    trackSignUp(ethSignData.address, username);
    trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.ETH, mirrorData.account);

    if (!options.noRedirect) {
      // Redirect to user profile page with rewards if it exists.
      const rewards = localStorage.getItem(LOCAL_STORAGE_KEYS.YUP_REWARDS);
      if (rewards) {
        await router.push(
          `/account/${username}${rewards ? `?rewards=${rewards}` : ''}`
        );
      } else {
        await router.push('/');
      }
    }
    toastSuccess(ACCOUNT_CREATED);
    handleCloseModal();
  };

  // Render helpers
  const renderModalContent = () => {
    if (stage === AUTH_MODAL_STAGE.SIGN_IN) {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <AuthMethodButton
                  text="Wallet"
                  imageUrl="/images/icons/wallet_connect.png"
                  onClick={() => {
                    setCurrAuthMethod(AUTH_TYPE.ETH);
                    openConnectModal();
                  }}
                />
              )}
            </ConnectButton.Custom>
          </Grid>
          <Grid item>
            <AuthMethodButton
              text="Twitter"
              imageUrl="/images/icons/twitter.svg"
              onClick={handleAuthWithTwitter}
            />
          </Grid>
          <Grid item>
            <AuthInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onEnter={handleSignUpWithEmail}
            />
          </Grid>
        </Grid>
      );
    }

    return (
      <Stepper
        className={classes.stepper}
        activeStep={2}
        orientation="vertical"
      >
        <Step>
          <StepLabel>Connect Ethereum Account</StepLabel>
          <StepContent />
        </Step>
        <Step>
          <StepLabel>Verify Ownership</StepLabel>
          <StepContent />
        </Step>
        {stage === AUTH_MODAL_STAGE.REQUIRE_EMAIL && (
          <Step>
            <StepLabel>Ethereum Whitelist Application</StepLabel>
            <StepContent>
              <Typography variant="body1" gutterBottom>
                Your address needs to be whitelisted. Please add your email so
                we can notify you.
              </Typography>
              <AuthInput
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onEnter={handleRequestWhitelist}
              />
            </StepContent>
          </Step>
        )}
        {stage === AUTH_MODAL_STAGE.REQUIRE_USERNAME && (
          <Step>
            <StepLabel>Create Account</StepLabel>
            <StepContent>
              <Typography variant="body1" gutterBottom>
                Please enter a Yup username to create your account.
              </Typography>
              <AuthInput
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onEnter={handleETHSignUp}
              />
            </StepContent>
          </Step>
        )}
      </Stepper>
    );
  };

  return (
    <AuthModalContext.Provider
      value={{
        open: handleOpenModal,
        startEthAuth: handleStartEthAuth,
        linkEthAddress: handleStartLinkEthAddress
      }}
    >
      {children}

      <YupDialog
        headline="Sign Up / Login"
        description={
          <Hidden lgDown>
            {stage === AUTH_MODAL_STAGE.SIGN_IN
              ? 'Earn money & clout for liking content anywhere on the internet. Get extra rewards for joining today.'
              : "Please sign up with an 'active' wallet, one that has held some ETH or YUP before. Fresh unused wallets will not be whitelisted and will need to be approved."}
          </Hidden>
        }
        open={modalOpen}
        onClose={handleCloseModal}
      >
        {renderModalContent()}
      </YupDialog>
    </AuthModalContext.Provider>
  );
};

AuthModalContextProvider.propTypes = {
  children: PropTypes.node
};

export default AuthModalContext;

export const useAuthModal = () => React.useContext(AuthModalContext);
