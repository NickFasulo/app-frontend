import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  Snackbar,
  SnackbarContent,
  Icon
} from '@mui/material';
import { useRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import axios from 'axios';
import CountUp from 'react-countup';
import { isAddress } from 'web3-utils';
import { TwitterShareButton } from 'react-share';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import { YupInput, YupButton, LoaderButton } from '../components/Miscellaneous';
import rollbar from '../utils/rollbar';
import MetaTags from '../components/Airdrop/MetaTags';
import { Mono, Prime } from '../utils/colors';
import { PageBody } from '../_pages/pageLayouts';
import { apiBaseUrl, webAppUrl } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';

const styles = (theme) => ({
  page: {
    minHeight: '100vh',
    maxWidth: '100vw',
    backgroundColor: theme.palette.M900
  },
  balanceContainer: {
    borderRadius: '0.65rem',
    border: `solid 2px ${theme.palette.M700}`
  },
  card: {
    padding: theme.spacing(6),
    width: 450,
    boxShadow: `0px 0px 30px 0px ${theme.palette.M400}44, 0px 0px 0.75px  ${theme.palette.M400}66`,
    backgroundColor: theme.palette.M900,
    [theme.breakpoints.down('md')]: {
      width: 350
    }
  },
  twitterBtn: {
    width: '100%',
    color: '#1DA1F2',
    borderColor: '#1DA1F2'
  },
  rainbowBtn: {
    background: theme.palette.gradients.horizontal
  },
  stepper: {
    position: 'fixed',
    top: 20
  }
});

function Migration({ classes }) {
  const [isLoading, setIsLoading] = useState(false);
  const [polygonAddress, setPolygonAddress] = useState(null);
  const [airdrop, setAirdrop] = useState(null);
  const [lpAidrop, setLpAidrop] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [lpClaimSuccess, setLpClaimSuccess] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const { isLoggedIn, authInfo } = useAuth();

  useEffect(() => {
    setPolygonAddress(router.pathname.split('/')[2] || '');
  }, [router]);

  useEffect(() => {
    const redirect = localStorage.getItem('twitterRedirect');
    setTimeout(() => {
      fetchAirdropData();
    }, 1000);
    if (redirect) {
      localStorage.removeItem('twitterRedirect');
    } else {
      localStorage.setItem('twitterRedirect', 'migration'); // ensure twitter login process brings them back to this page
    }
  }, []);

  const handleCopy = () => navigator.clipboard.writeText(window.location.href);

  const handleInput = (e) => setPolygonAddress(e.target.value.toLowerCase());

  const handleSnackbarClose = () => setSnackbarMsg('');

  const claimAirdrop = async () => {
    if (!isAddress(polygonAddress)) {
      setSnackbarMsg('Please enter a valid polygon address');
      return;
    }

    let hasAvailableLpAirdrop =
      lpAidrop.amount > 0 && !lpClaimSuccess && !lpAidrop.claimed;

    setIsLoading(true);
    setActiveStep(2);

    const params = { polygonAddress, eosname: authInfo.eosname, ...authInfo };
    if (hasAvailableLpAirdrop) {
      try {
        await axios.post(`${apiBaseUrl}/lp-airdrop/claim`, params);

        setLpClaimSuccess(true);
        setActiveStep(3);
        hasAvailableLpAirdrop = false;
      } catch (err) {
        setSnackbarMsg(err.response && err.response.data.message);
      }
    }

    try {
      await axios.post(`${apiBaseUrl}/airdrop/claim`, params);
      setActiveStep(3);
    } catch (err) {
      rollbar.error(`Error claiming airdrop: ${JSON.stringify(err)}`);
      setSnackbarMsg(err.response && err.response.data.message);
    }

    setIsLoading(false);
  };

  const fetchAirdropData = async () => {
    try {
      setIsLoading(true);
      const airdrop = (
        await axios.get(`${apiBaseUrl}/airdrop?eosname=${authInfo.eosname}`)
      ).data;
      const lpAidrop = (
        await axios.get(`${apiBaseUrl}/lp-airdrop?eosname=${authInfo.eosname}`)
      ).data;
      setAirdrop(airdrop);
      setLpAidrop(lpAidrop);
      setActiveStep(1);
    } catch (err) {
      rollbar.error(`Error fetching airdrop data: ${JSON.stringify(err)}`);
      setSnackbarMsg('Something went wrong. Try again later.');
    }

    setIsLoading(false);
  };

  const isValidAddress = isAddress(polygonAddress);

  const enableClaim = (airdrop || lpAidrop) && isValidAddress;
  const shareStep = activeStep === 3;

  return (
    <ErrorBoundary>
      <MetaTags polygonAddress={polygonAddress} airdrop={airdrop} />
      <Snackbar
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <SnackbarContent message={snackbarMsg} />
      </Snackbar>

      <PageBody className={classes.page}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.page}
        >
          <Card className={classes.card} elevation={0}>
            <Grid
              container
              alignItems="stretch"
              direction="column"
              justifyContent="center"
              spacing={3}
            >
              <Grid container direction="row" justifyContent="space-around">
                <img
                  src="/images/graphics/yuppoly.png"
                  alt="yup logo"
                  height="90"
                />
              </Grid>
              <Grid item>
                <Typography variant="h5" align="center">
                  {shareStep
                    ? 'Congratulations. Your tokens will arrive in about 6 hours.'
                    : 'Polygon Migration'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" align="center">
                  {isLoggedIn
                    ? shareStep
                      ? "You've claimed"
                      : 'You can claim'
                    : 'Connect to your account to claim'}
                </Typography>
              </Grid>
              {isLoggedIn ? (
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography
                        variant="h3"
                        style={{
                          color: airdrop ? Prime.P500 : Mono.M900,
                          textAlign: 'center'
                        }}
                      >
                        <CountUp
                          end={airdrop && airdrop.amount}
                          decimals={2}
                          start={0}
                          duration={2}
                          suffix=" YUP"
                        />
                      </Typography>
                    </Grid>
                    {lpAidrop ? (
                      <Grid item>
                        <Grid container direction="column" alignItems="center">
                          <Grid item>
                            <Typography variant="s1" style={{ opacity: 0.3 }}>
                              &
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="h3"
                              style={{
                                color: lpAidrop ? Prime.P500 : Mono.M900,
                                textAlign: 'center'
                              }}
                            >
                              <CountUp
                                end={lpAidrop && lpAidrop.amount}
                                decimals={2}
                                start={0}
                                duration={2}
                                suffix=" YUPETH"
                              />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              ) : null}
              {lpAidrop ? (
                shareStep ? (
                  <Grid item>
                    <YupButton
                      fullWidth
                      onClick={`${webAppUrl}/staking`}
                      className={classes.rainbowBtn}
                      variant="contained"
                      startIcon={<Icon className="fa fa-upload" />}
                    >
                      Stake
                    </YupButton>
                  </Grid>
                ) : null
              ) : null}
              {isLoggedIn ? (
                <Grid item>
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <Typography variant="body2" align="center">
                        {shareStep
                          ? 'Let the people know!'
                          : 'Input a Polygon address to link account & receive tokens'}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <YupInput
                        style={{ display: shareStep ? 'none' : 'inherit' }}
                        fullWidth
                        id="address"
                        maxLength={50}
                        label="Address"
                        type="text"
                        onSubmit={fetchAirdropData}
                        inputIsValid={isValidAddress}
                        value={polygonAddress}
                        variant="outlined"
                        onChange={handleInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
              <Grid item>
                {!shareStep ? (
                  isLoggedIn ? (
                    <LoaderButton
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      buttonText="Claim"
                      disabled={!enableClaim}
                      isLoading={isLoading}
                      onClick={claimAirdrop}
                    />
                  ) : (
                    <YupButton
                      fullWidth
                      onClick={() => openAuthModal()}
                      variant="contained"
                      color="primary"
                    >
                      Login
                    </YupButton>
                  )
                ) : (
                  <Grid
                    container
                    direction="row"
                    alignContent="stretch"
                    spacing={1}
                  >
                    <Grid item xs={6}>
                      <TwitterShareButton
                        url={`${webAppUrl}/migration`}
                        title="Claiming #polygon airdrop on @yup_io"
                        hashtags={['YUP']}
                        windowWidth={800}
                        windowHeight={600}
                      >
                        <YupButton
                          fullWidth
                          onClick={handleCopy}
                          variant="outlined"
                          color="secondary"
                          startIcon={<Icon className="fa fa-copy fa-2x" />}
                        >
                          Copy
                        </YupButton>
                      </TwitterShareButton>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </PageBody>
    </ErrorBoundary>
  );
}

export default withStyles(styles)(Migration);
