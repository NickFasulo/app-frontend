import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import { Grid, Typography, Card, Tabs, Tab } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Helmet } from 'react-helmet';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSigner,
  useSwitchNetwork,
  usePrepareContractWrite
} from 'wagmi';

import CountUp from 'react-countup';
import axios from 'axios';
import { ethers } from 'ethers';
import { getPolyContractAddresses } from '@yupio/contract-addresses';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import {
  YupInput,
  YupButton,
  LoadingBar
} from '../../components/Miscellaneous';
import LIQUIDITY_ABI from '../../abis/LiquidityRewards.json';
import YUPETH_ABI from '../../abis/YUPETH.json';
import { PageBody } from '../pageLayouts';
import useToast from '../../hooks/useToast';
import {
  polygonConfig,
  rewardsManagerApi,
  subgraphApiEthUrl,
  subgraphApiPolygonUrl,
  yupBuyLink,
  yupDocsUrl
} from '../../config';
import { useLpRewards } from '../../hooks/queries';

const {
  POLY_LIQUIDITY_REWARDS,
  POLY_UNI_LP_TOKEN,
  ETH_UNI_LP_TOKEN,
  ETH_LIQUIDITY_REWARDS
} = getPolyContractAddresses(Number(polygonConfig.chainId));

const toBaseNum = (num) => num / 10 ** 18;
const toGwei = (num) => num * 10 ** 18;
const formatDecimals = (num) => Number(Number(num).toFixed(5));

const styles = (theme) => ({
  container: {
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowY: 'hidden'
  },
  submitBtnTxt: {
    color: theme.palette.M900
  },
  page: {
    width: '100%',
    margin: '34px 0',
    overflowX: 'hidden'
  },
  submitBtn: {
    background: theme.palette.gradients.horizontal,
    height: '100%'
  },
  aprText: {
    background: '-webkit-linear-gradient(45deg, #00e08e, #f0c909, #eb3650)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  card: {
    padding: 20,
    background: `${theme.palette.M900}80`,
    backdropFilter: 'blur(20px)',
    boxShadow: `0px 0px 10px 0px ${theme.palette.M200}05, 0px 0px 0.75px  ${theme.palette.M200}05`
  },
  counterSizeFixed: {
    width: '360px',
    [theme.breakpoints.down('md')]: {
      width: '250px'
    }
  }
});

const isInvalidStakeAmt = (amt) => {
  const stakeAmt = Number(amt);
  return Number.isNaN(stakeAmt) || stakeAmt <= 0;
};

const StakingPage = ({ classes }) => {
  const theme = useTheme();
  const { toastError, toastInfo } = useToast();

  const [activePolyTab, setActivePolyTab] = useState(0);
  const [activeEthTab, setActiveEthTab] = useState(0);

  const [ethStakeInput, setEthStakeInput] = useState(0); // amount of eth uni lp to stake
  const [polyStakeInput, setPolyStakeInput] = useState(0); // amount of poly uni lp to stake

  const [polyApr, setPolyApr] = useState(0);
  const [ethApr, setEthApr] = useState(0);

  const [earnings, setEarnings] = useState(null);
  const [predictedRewardRate, setPredictedRewardRate] = useState(null);
  const [predictedRewards, setPredictedRewards] = useState({ prev: 0, new: 0 });

  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const LpRewards = useLpRewards(address);
  const { config: approveEthConfig } = usePrepareContractWrite({
    addressOrName: ETH_UNI_LP_TOKEN,
    contractInterface: YUPETH_ABI,
    functionName: 'approve',
    args: [
      ETH_LIQUIDITY_REWARDS,
      !isInvalidStakeAmt(ethStakeInput) &&
      ethers.utils.parseEther(ethStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(ethStakeInput)
  });

  const { config: stakeEthConfig } = usePrepareContractWrite({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'stake',
    args: [
      !isInvalidStakeAmt(ethStakeInput) &&
      ethers.utils.parseEther(ethStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(ethStakeInput)
  });

  const { config: unstakeEthConfig } = usePrepareContractWrite({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'unstake',
    args: [
      !isInvalidStakeAmt(ethStakeInput) &&
      ethers.utils.parseEther(ethStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(ethStakeInput)
  });
  const { config: getRewardEthConfig } = usePrepareContractWrite({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'getReward'
  });

  const { config: approvePolyConfig, error } = usePrepareContractWrite({
    addressOrName: POLY_UNI_LP_TOKEN,
    contractInterface: YUPETH_ABI,
    functionName: 'approve',
    args: [
      POLY_LIQUIDITY_REWARDS,
      !isInvalidStakeAmt(polyStakeInput) &&
      ethers.utils.parseEther(polyStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(polyStakeInput)
  });

  const { config: stakePolyConfig } = usePrepareContractWrite({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'stake',
    args: [
      !isInvalidStakeAmt(polyStakeInput) &&
      ethers.utils.parseEther(polyStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(polyStakeInput)
  });

  const { config: unstakePolyConfig } = usePrepareContractWrite({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'unstake',
    args: [
      !isInvalidStakeAmt(polyStakeInput) &&
      ethers.utils.parseEther(polyStakeInput.toString()).toString()
    ],
    enabled: !isInvalidStakeAmt(polyStakeInput)
  });

  const { config: getRewardPolyConfig } = usePrepareContractWrite({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'getReward'
  });

  const {
    data: approveEthData,
    isLoading: approveEthLoading,
    write: approveEth
  } = useContractWrite(approveEthConfig);
  const {
    data: stakeEthDate,
    isLoading: stakeEthLoading,
    write: stakeEth
  } = useContractWrite({
    ...stakeEthConfig,
    onSuccess: () => {
      toastInfo('You have succesfully staked your YUP-ETH LP tokens!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });
  const {
    data: unstakeEthData,
    isLoading: unstakeEthLoading,
    write: unstakeEth
  } = useContractWrite({
    ...unstakeEthConfig,
    onSuccess: () => {
      toastInfo('You have succesfully staked your YUP-ETH LP tokens!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });
  const {
    data: getRewardEthData,
    isLoading: getRewardEthLoading,
    write: getRewardEth
  } = useContractWrite({
    ...getRewardEthConfig,
    onSuccess: () => {
      toastInfo('You have succesfully collected your Eth rewards!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });
  const {
    data: approvePolyData,
    isLoading: approvePolyLoading,
    write: approvePoly
  } = useContractWrite(approvePolyConfig);
  const {
    data: stakePolyDate,
    isLoading: stakePolyLoading,
    write: stakePoly
  } = useContractWrite({
    ...stakePolyConfig,
    onSuccess: () => {
      toastInfo('You have succesfully staked your YUP-WETH LP tokens!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });
  const {
    data: unstakePolyData,
    isLoading: unstakePolyLoading,
    write: unstakePoly
  } = useContractWrite({
    ...unstakePolyConfig,
    onSuccess: () => {
      toastInfo('You have succesfully unstaked your YUP-WETH LP Tokens!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });
  const {
    data: getRewardPolyData,
    isLoading: getRewardPolyLoading,
    write: getRewardPoly
  } = useContractWrite({
    ...getRewardPolyConfig,
    onSuccess: () => {
      toastInfo('You have succesfully collected your Poly rewards!');
      setIsLoading(false);
    },
    onError: (error) => {
      toastError(error.message);
      setIsLoading(false);
    }
  });

  const { data: currentStakePoly } = useContractRead({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: !!address
  });

  const { data: currentTotalStakePoly } = useContractRead({
    addressOrName: POLY_UNI_LP_TOKEN,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [POLY_LIQUIDITY_REWARDS],
    watch: true
  });

  const { data: polyRR } = useContractRead({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'rewardRate'
  });

  const { data: currentStakeEth } = useContractRead({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: !!address
  });
  const { data: currentTotalStakeEth } = useContractRead({
    addressOrName: ETH_UNI_LP_TOKEN,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [ETH_LIQUIDITY_REWARDS],
    watch: true
  });
  const { data: ethRR } = useContractRead({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'rewardRate'
  });
  const { data: polyLpBal } = useContractRead({
    addressOrName: POLY_UNI_LP_TOKEN,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: !!address
  });
  const { data: ethLpBal } = useContractRead({
    addressOrName: ETH_UNI_LP_TOKEN,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: !!address
  });

  const { data: polyRwrdAmt } = useContractRead({
    addressOrName: POLY_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'earned',
    args: [address],
    watch: true,
    enabled: !!address
  });

  const { data: ethRwrdAmt } = useContractRead({
    addressOrName: ETH_LIQUIDITY_REWARDS,
    contractInterface: LIQUIDITY_ABI,
    functionName: 'earned',
    args: [address],
    watch: true,
    enabled: !!address
  });
  console.log({ ethLpBal }, error);

  const handleEthTabChange = (e, newTab) => setActiveEthTab(newTab);
  const handlePolyTabChange = (e, newTab) => setActivePolyTab(newTab);
  const handleEthStakeAmountChange = ({ target }) =>
    setEthStakeInput(target.value);
  const handlePolyStakeAmountChange = ({ target }) =>
    setPolyStakeInput(target.value);

  const handleEthStakeMax = () =>
    setEthStakeInput(toBaseNum(!activeEthTab ? ethLpBal : currentStakeEth));
  const handlePolyStakeMax = () =>
    setPolyStakeInput(toBaseNum(!activePolyTab ? polyLpBal : currentStakePoly));
  useEffect(() => {
    getAprs();
  }, []);

  useEffect(() => {
    console.log(predictedRewardRate);
    if (
      (!ethLpBal ||
        !polyLpBal ||
        !currentTotalStakePoly ||
        !currentTotalStakeEth,
        predictedRewardRate)
    ) {
      return;
    }
    getPredictedRewardRate();
  }, [currentTotalStakePoly, currentTotalStakeEth, ethLpBal, polyLpBal]);

  useEffect(() => {
    if (!predictedRewardRate) {
      return;
    }
    updateRewardStream();
  }, [predictedRewardRate]);

  useEffect(() => {
    if (!isConnected) {
      toastInfo(
        'Connect your wallet to see your balance and perform staking actions.'
      );
    }

    // Poly is default chain now, and users are triggerd a network change by rainbow automatically
    // Is a bug in my opinion, but we'll see if it's fixed
    // Github issue for tracking:  https://github.com/rainbow-me/rainbowkit/issues/563

    // if (chain.id !== polygonConfig.chainId && switchNetwork) {
    //   toastInfo('Please switch network to Polygon to stake.');
    //   switchNetwork(polygonConfig.chainId);

    //   return;
    // }

    // return () => handleDisconnect();
  }, [isConnected, chain?.id]);

  const updateRewardStream = async () => {
    setTimeout(() => {
      setPredictedRewards((prevState) => ({
        prev: prevState.new,
        new: prevState.new + predictedRewardRate
      }));
      updateRewardStream();
    }, 1000);
  };

  const getPredictedRewardRate = async () => {
    const ethPredictedRR =
      (toBaseNum(currentStakeEth) * toBaseNum(ethRR)) /
      toBaseNum(currentTotalStakeEth);
    const polyPredictedRR =
      (toBaseNum(currentStakePoly) * toBaseNum(polyRR)) /
      toBaseNum(currentTotalStakePoly);
    setPredictedRewardRate(ethPredictedRR + polyPredictedRR);
  };

  const getAprs = async () => {
    try {
      const ethApr = (await axios.get(`${rewardsManagerApi}/aprs/eth`)).data;
      const polyApr = (await axios.get(`${rewardsManagerApi}/aprs/poly`)).data;
      setEthApr(ethApr);
      setPolyApr(polyApr);
    } catch (err) {
      console.log('ERR fetching rwrds and aprs', err);
    }
  };

  const handleStakingAction = async (lpToken) => {
    if (lpToken === 'eth') {
      startEthStakeAction();
    } else if (lpToken === 'poly') {
      startPolyStakeAction();
    }
  };

  const startEthStakeAction = async () => {
    if (isInvalidStakeAmt(ethStakeInput)) {
      toastError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    const isStake = !activeEthTab;
    const stakeAmt = ethers.utils
      .parseEther(ethStakeInput.toString())
      .toString();
    approveEth(ETH_LIQUIDITY_REWARDS, stakeAmt);
    if (isStake) {
      stakeEth({
        args: [stakeAmt]
      });
    } else {
      console.log(stakeAmt);
      unstakeEth({
        args: [stakeAmt]
      });
    }
  };

  const startPolyStakeAction = async () => {
    if (isInvalidStakeAmt(polyStakeInput)) {
      toastError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    const isStake = !activePolyTab;
    const stakeAmt = ethers.utils
      .parseEther(polyStakeInput.toString())
      .toString();
    approvePoly(POLY_LIQUIDITY_REWARDS, stakeAmt);
    if (isStake) {
      stakePoly({
        args: [stakeAmt]
      });
    } else {
      unstakePoly({
        args: [stakeAmt]
      });
    }
  };

  const collectRewards = async () => {
    setIsLoading(true);
    toastInfo(
      'Sign the transactions to collect you rewards. There will be one transaction for each pool you are in.'
    );
    if (ethRwrdAmt > 0) {
      getRewardEth();
    }
    if (polyRwrdAmt > 0) {
      getRewardPoly();
    }
  };
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Yup Staking </title>
        <meta
          property="description"
          content="A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain."
        />
        <meta
          property="image"
          content="https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yup Polygon Migration" />
        <meta name="twitter:site" content="@yup_io" />
        <meta
          name="twitter:description"
          content="A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain."
        />
        <meta
          name="twitter:image"
          content="https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg"
        />
        <meta property="og:title" content="Yup Polygon Migration" />
        <meta
          property="og:description"
          content="A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain."
        />
        <meta
          property="og:image"
          content="https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg"
        />
      </Helmet>
      <Grid container className={classes.container}>
        <PageBody scrollable>
          <Grid
            className={classes.page}
            container
            direction="column"
            justifyContent="center"
            alignItems="start"
            rowSpacing={{ xs: 1, sm: 3, md: 5 }}
          >
            <LoadingBar isLoading={isLoading} />
            <Grid item>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="subtitle1">
                    Provide liquidity, earn up to
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h1" className={classes.aprText}>
                    <CountUp
                      end={Math.max(polyApr, ethApr)}
                      decimals={2}
                      start={0}
                      duration={3}
                      suffix="% APR"
                    />
                  </Typography>
                </Grid>
                <Grid item container direction="row" spacing={2}>
                  <Grid item ml={1}>
                    <YupButton
                      color="secondary"
                      variant="outlined"
                      href={yupBuyLink}
                      target="_blank"
                    >
                      {' '}
                      Buy YUP{' '}
                    </YupButton>
                  </Grid>
                  <Grid item>
                    <YupButton
                      color="secondary"
                      variant="outlined"
                      href={`${yupDocsUrl}/protocol/yup-protocol`}
                      target="_blank"
                    >
                      {' '}
                      Learn More{' '}
                    </YupButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="start"
                spacing={5}
              >
                <Grid item xs={12} md={6}>
                  <Grid container direction="row" spacing={4}>
                    <Grid item xs={3}>
                      <img
                        style={{ width: '100%' }}
                        src="images/graphics/yupeth.svg"
                        alt="yupeth graphic"
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="subtitle1">
                            Stake YUP-ETH LP Tokens
                            <br />
                            Uniswap V2 • Ethereum
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">
                            {`${ethApr && formatDecimals(ethApr)}% APR`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <Grid item>
                        <Card className={classes.card} elevation={0}>
                          <Grid container direction="column" spacing={2}>
                            <Grid item>
                              <Tabs
                                value={activeEthTab}
                                onChange={handleEthTabChange}
                                TabIndicatorProps={{
                                  style: {
                                    background:
                                      theme.palette.gradients.horizontal
                                  }
                                }}
                              >
                                <Tab label="Staked" />
                                <Tab label="Unstaked" />
                              </Tabs>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container direction="column" spacing={2}>
                                <Grid item>
                                  <Grid container direction="row" spacing={1}>
                                    <Grid item xs>
                                      <Grid
                                        container
                                        justifyContent="space-between"
                                      >
                                        <YupInput
                                          fullWidth
                                          id="stake-amount"
                                          maxLength="10"
                                          type="number"
                                          variant="outlined"
                                          size="small"
                                          value={ethStakeInput}
                                          onChange={handleEthStakeAmountChange}
                                          endAdornment={
                                            <YupButton
                                              size="xs"
                                              variant="text"
                                              color="secondary"
                                              onClick={handleEthStakeMax}
                                            >
                                              Max
                                            </YupButton>
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid item>
                                      <ConnectButton.Custom>
                                        {({ openConnectModal }) => (
                                          <YupButton
                                            size="large"
                                            variant="contained"
                                            className={classes.submitBtn}
                                          >
                                            <Typography
                                              variant="body1"
                                              className={classes.submitBtnTxt}
                                              onClick={() => {
                                                if (isConnected) {
                                                  handleStakingAction('eth');
                                                } else {
                                                  openConnectModal();
                                                }
                                              }}
                                            >
                                              {isConnected
                                                ? activeEthTab
                                                  ? 'Unstake'
                                                  : 'Stake'
                                                : 'Connect'}
                                            </Typography>
                                          </YupButton>
                                        )}
                                      </ConnectButton.Custom>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Grid container direction="column">
                                    <Grid item>
                                      <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                      >
                                        <Grid item>
                                          <Typography variant="body2">
                                            UNI V2 YUP-ETH LP in wallet:
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography variant="body2">
                                            {formatDecimals(
                                              toBaseNum(ethLpBal || 0)
                                            )}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid item>
                                        <Grid
                                          container
                                          direction="row"
                                          justifyContent="space-between"
                                        >
                                          <Grid item>
                                            <Typography variant="body2">
                                              Staked:
                                            </Typography>
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="body2">
                                              {formatDecimals(
                                                toBaseNum(currentStakeEth || 0)
                                              )}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container direction="row" spacing={4}>
                    <Grid item xs={3}>
                      <img
                        style={{ width: '100%' }}
                        src="images/graphics/yupmatic.svg"
                        alt="yupmatic graphic"
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="subtitle1">
                            Stake YUP-WETH LP Tokens <br /> Quickswap • Polygon
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">
                            {`${polyApr && formatDecimals(polyApr)}% APR`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs>
                      <Grid item>
                        <Card className={classes.card} elevation={0}>
                          <Grid container direction="column" spacing={2}>
                            <Grid item>
                              <Tabs
                                value={activePolyTab}
                                onChange={handlePolyTabChange}
                                TabIndicatorProps={{
                                  style: {
                                    background:
                                      theme.palette.gradients.horizontal
                                  }
                                }}
                              >
                                <Tab label="Staked" />
                                <Tab label="Unstaked" />
                              </Tabs>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container direction="column" spacing={2}>
                                <Grid item>
                                  <Grid container direction="row" spacing={1}>
                                    <Grid item xs>
                                      <Grid
                                        container
                                        justifyContent="space-between"
                                      >
                                        <YupInput
                                          fullWidth
                                          id="stake-amount"
                                          maxLength="10"
                                          type="number"
                                          variant="outlined"
                                          size="small"
                                          value={polyStakeInput}
                                          onChange={handlePolyStakeAmountChange}
                                          endAdornment={
                                            <YupButton
                                              size="xs"
                                              variant="text"
                                              onClick={handlePolyStakeMax}
                                              className={classes.maxBtn}
                                            >
                                              Max
                                            </YupButton>
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid item>
                                      <ConnectButton.Custom>
                                        {({ openConnectModal }) => (
                                          <YupButton
                                            size="large"
                                            variant="contained"
                                            className={classes.submitBtn}
                                            onClick={() => {
                                              if (isConnected) {
                                                handleStakingAction('poly');
                                              } else {
                                                openConnectModal();
                                              }
                                            }}
                                          >
                                            <Typography
                                              variant="body1"
                                              className={classes.submitBtnTxt}
                                            >
                                              {isConnected
                                                ? activePolyTab
                                                  ? 'Unstake'
                                                  : 'Stake'
                                                : 'Connect'}
                                            </Typography>
                                          </YupButton>
                                        )}
                                      </ConnectButton.Custom>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Grid container direction="column">
                                    <Grid item>
                                      <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                      >
                                        <Grid item>
                                          <Typography variant="body2">
                                            UNI V2 YUP-WETH LP in wallet:
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography variant="body2">
                                            {formatDecimals(
                                              toBaseNum(polyLpBal || 0)
                                            )}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid item>
                                        <Grid
                                          container
                                          direction="row"
                                          justifyContent="space-between"
                                        >
                                          <Grid item>
                                            <Typography variant="body2">
                                              Staked:
                                            </Typography>
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="body2">
                                              {formatDecimals(
                                                toBaseNum(currentStakePoly || 0)
                                              )}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item alignSelf="center">
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
              >
                <Grid
                  item
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={5}
                >
                  <Grid item>
                    <Typography variant="h5">Rewards to Collect</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">What’s this?</Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item className={classes.counterSizeFixed}>
                    <Typography variant="h3">
                      {toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) === 0 ? (
                        `${0} YUP`
                      ) : (
                        <CountUp
                          end={
                            toBaseNum(polyRwrdAmt) +
                            toBaseNum(ethRwrdAmt) +
                            predictedRewards.new
                          }
                          start={
                            toBaseNum(polyRwrdAmt) +
                            toBaseNum(ethRwrdAmt) +
                            predictedRewards.prev
                          }
                          decimals={5}
                          duration={1}
                          suffix=" YUP"
                        />
                      )}
                    </Typography>
                    {/* <YupInput
                                      fullWidth
                                      id='stake-amount'
                                      maxLength='10'
                                      type='number'
                                      variant='outlined'
                                      size='small'
                                      disabled
                                      value={formatDecimals(toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt))}
                                      startAdornment={
                                        <InputAdornment position='start'>
                                          <img src='public/images/logos/logo_g.svg' />
                                        </InputAdornment>
                                            }
                                          /> */}
                  </Grid>
                  {(!isConnected
                    ? true
                    : toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) > 0) && (
                      <Grid item>
                        <ConnectButton.Custom>
                          {({ openConnectModal }) => (
                            <YupButton
                              size="large"
                              variant="contained"
                              className={classes.submitBtn}
                              onClick={() => {
                                if (isConnected) {
                                  collectRewards();
                                } else {
                                  openConnectModal();
                                }
                              }}
                            >
                              <Typography
                                variant="body1"
                                className={classes.submitBtnTxt}
                              >
                                {isConnected ? 'Collect' : 'Connect'}
                              </Typography>
                            </YupButton>
                          )}
                        </ConnectButton.Custom>
                      </Grid>
                    )}
                </Grid>
                {earnings && (
                  <Grid
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography variant="subtitle2">
                        {formatDecimals(
                          toBaseNum(earnings) +
                          LpRewards.poly +
                          LpRewards.eth +
                          predictedRewards.new
                        )}{' '}
                        YUP Earned in Total
                      </Typography>
                      {/* <YupInput
                                      fullWidth
                                      id='stake-amount'
                                      maxLength='10'
                                      type='number'
                                      variant='outlined'
                                      size='small'
                                      disabled
                                      value={formatDecimals(toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt))}
                                      startAdornment={
                                        <InputAdornment position='start'>
                                          <img src='public/images/logos/logo_g.svg' />
                                        </InputAdornment>
                                            }
                                          /> */}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </Grid>
    </ErrorBoundary>
  );
};

StakingPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default memo(withStyles(styles)(StakingPage));
