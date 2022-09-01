import {
  ActionButton,
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupCountUp
} from '../styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { levelColors } from '../../utils/colors';
import { useFollowers, useFollowings, useUserLikes } from '../../hooks/queries';
import FollowerSection from './FollowerSection';
import { Chip, Typography } from '@mui/material';
import {
  etherscanUrl,
  formatDecimal,
  shortenEthAddress,
  twitterUrl
} from '../../utils/helpers';
import YupLogoEmoji from './YupLogoEmoji';
import useDevice from '../../hooks/useDevice';
import { useEffect, useState } from 'react';
import EditProfile from '../EditProfile/EditProfile';
import { useAuth } from '../../contexts/AuthContext';
import { useAccount, useEnsName, useSignMessage } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { apiGetChallenge, apiSetETHAddress } from '../../apis';
import { logError } from '../../utils/logging';
import useToast from '../../hooks/useToast';
import { queryClient } from '../../config/react-query';
import { REACT_QUERY_KEYS } from '../../constants/enum';
import { useMutation } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import FollowButton from '../FollowButton';

const ProfileHeader = ({ profile, hidden }) => {
  const { isMobile, isDesktop } = useDevice();
  const {
    quantile,
    avatar,
    username,
    fullname,
    _id: id,
    ethInfo,
    twitterInfo,
    weight: influence,
    balance
  } = profile;
  const { isLoggedIn, name: authName } = useAuth();
  const followings = useFollowings(id);
  const followers = useFollowers(id);
  const likeCount = useUserLikes(id);
  const { data: ensName } = useEnsName({
    address: ethInfo?.address,
    chainId: 1
  });
  const { openConnectModal } = useConnectModal();
  const { address: connectedEthAddress } = useAccount();
  const { toastError, toastSuccess, toastInfo } = useToast();
  const { signMessageAsync } = useSignMessage();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [connectWalletClicked, setConnectWalletClicked] = useState(false);

  const isMyProfile = isLoggedIn && authName === id;
  const userColor = levelColors[quantile || 'none'];
  const yupScore = Math.floor(profile.score || 1);

  const handleConnectWallet = () => {
    setConnectWalletClicked(true);
    openConnectModal?.();
  };

  const {
    mutate: updateEthAddress,
    isLoading: isUpdatingEthAddress
  } = useMutation(async (ethAddress) => {
    const rspChallenge = await apiGetChallenge({
      address: ethAddress
    });

    const signature = await signMessageAsync({
      message: rspChallenge.data
    });

    await apiSetETHAddress(ethAddress, {
      eosname: id,
      signature
    });
  }, {
    onError: (err) => {
      logError('Failed to link ETH address', err);
      toastError('Failed to link ETH address, please try again later.');
    },
    onSuccess: (data, ethAddress) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.YUP_SOCIAL_LEVEL, username],
        (oldData) => ({
          ...oldData,
          ethInfo: {
            address: ethAddress
          }
        })
      );

      toastSuccess('Successfully linked ETH address.');
    }
  });

  useEffect(() => {
    (async function() {
      if (ethInfo?.address) return ;
      if (!connectWalletClicked) return ;
      if (!connectedEthAddress) return ;

      updateEthAddress(connectedEthAddress);

      setConnectWalletClicked(false);
    })();
  }, [ethInfo, connectedEthAddress, connectWalletClicked]);

  useEffect(() =>  {
    if (isMyProfile && !ethInfo?.address) {
      toastInfo(
        'Connect your ETH Wallet to Earn Rewards.',
        {
          onClick: handleConnectWallet
        }
      );
    }
  }, [isMyProfile, ethInfo]);

  return (
    <YupContainer
      sx={{
        pb: 3,
        display: hidden ? 'none' : 'block'
      }}
    >
      <FlexBox columnGap={4}>
        <ProfilePicture src={avatar} alt={username} border={userColor}>
          {username?.toUpperCase().substring(0, 1)}
        </ProfilePicture>
        <FlexBox flexGrow={1} flexDirection="column" rowGap={1}>
          <FlexBox alignItems="center">
            <FlexBox flexGrow={1} alignItems="center" columnGap={1.5}>
              <GradientTypography variant="h3">
                {fullname || username}
              </GradientTypography>
            </FlexBox>
            <FlexBox alignItems="center" columnGap={3}>
              {isDesktop && (
                <FollowerSection
                  rating={likeCount}
                  followers={followers}
                  followings={followings}
                />
              )}
              {isMyProfile && (
                <ActionButton onClick={() => setEditModalOpen(true)}>
                  Edit
                </ActionButton>
              )}
              {isLoggedIn && !isMyProfile && (
                <FollowButton
                  userId={id}
                />
              )}
            </FlexBox>
          </FlexBox>
          <FlexBox columnGap={1}>
            {!isMobile && (
              <Chip
                label={`@${username}`}
                clickable
                component="a"
                target="_blank"
              />
            )}
            {!isMobile && ethInfo?.address && (
              <Chip
                icon={<FontAwesomeIcon size="12" icon={faEthereum} />}
                label={ensName || shortenEthAddress(ethInfo.address)}
                clickable
                component="a"
                href={etherscanUrl(ethInfo.address)}
                target="_blank"
              />
            )}
            {!isMobile && isMyProfile && !ethInfo?.address && (
              <Chip
                icon={<FontAwesomeIcon size="12" icon={faEthereum} />}
                label={
                  isUpdatingEthAddress
                    ? (
                      <CircularProgress
                        size={15}
                        sx={{ verticalAlign: 'middle' }}
                        color="inherit"
                      />
                    )
                    : 'Connect Wallet'
                }
                disabled={isUpdatingEthAddress}
                clickable
                onClick={handleConnectWallet}
              />
            )}
            {!isMobile && twitterInfo?.username && (
              <Chip
                icon={<FontAwesomeIcon icon={faTwitter} />}
                label={`@${twitterInfo.username}`}
                clickable
                component="a"
                href={twitterUrl(twitterInfo.username)}
                target="_blank"
              />
            )}
          </FlexBox>
          <FlexBox alignItems="center">
            <Typography variant="body2" sx={{ mr: 2 }}>
              <YupCountUp
                end={yupScore}
                duration={2}
                useEasing={false}
                color={userColor}
              />
              Yup Score
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              <YupCountUp end={influence} duration={2} useEasing={false} />
              Influence
            </Typography>
            <YupLogoEmoji />
            <Typography variant="body2" sx={{ ml: 1, color: '' }}>
              {formatDecimal(balance?.YUP || 0)}
            </Typography>
          </FlexBox>
          {!isDesktop && <FollowerSection />}
        </FlexBox>
      </FlexBox>
      <EditProfile
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        username={username}
        accountInfo={profile}
      />
    </YupContainer>
  );
};

export default ProfileHeader;
