import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/pro-regular-svg-icons';
import { faEthereum, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAccount, useEnsName, useSignMessage } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMutation } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ActionButton,
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupCountUp
} from '../styles';
import { levelColors } from '../../utils/colors';
import { useFollowers, useFollowings, useUserLikes } from '../../hooks/queries';
import FollowerSection from './FollowerSection';
import {
  etherscanUrl,
  formatDecimal,
  shortenEthAddress,
  twitterUrl,
  blockscanUrl
} from '../../utils/helpers';
import YupLogoEmoji from './YupLogoEmoji';
import useDevice from '../../hooks/useDevice';
import EditProfile from '../EditProfile/EditProfile';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetChallenge, apiSetETHAddress } from '../../apis';
import { logError } from '../../utils/logging';
import useToast from '../../hooks/useToast';
import { queryClient } from '../../config/react-query';
import { REACT_QUERY_KEYS } from '../../constants/enum';
import FollowButton from '../FollowButton';

function ProfileHeader({ profile, hidden }) {
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
  const { isLoggedIn, authInfo, name: authName } = useAuth();
  const { data: followings = [] } = useFollowings(id);
  const { data: followers = [] } = useFollowers(id);
  const { data: likeCount = 0 } = useUserLikes(id);
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

  const { mutate: updateEthAddress, isLoading: isUpdatingEthAddress } =
    useMutation(
      async (ethAddress) => {
        const rspChallenge = await apiGetChallenge({
          address: ethAddress
        });

        const signature = await signMessageAsync({
          message: rspChallenge.data
        });

        await apiSetETHAddress(ethAddress, {
          eosname: id,
          signature: authInfo.signature,
          ethSignature: signature
        });
      },
      {
        onError: (err) => {
          logError('Failed to link ETH address', err);
          toastError('Failed to link ETH address, please try again later.');
        },
        onSuccess: (data, ethAddress) => {
          queryClient.setQueryData(
            [REACT_QUERY_KEYS.ACCOUNT, username],
            (oldData) => ({
              ...oldData,
              ethInfo: {
                address: ethAddress
              }
            })
          );

          toastSuccess('Successfully linked ETH address.');
        }
      }
    );

  useEffect(() => {
    (async function () {
      if (ethInfo?.address) return;
      if (!connectWalletClicked) return;
      if (!connectedEthAddress) return;

      updateEthAddress(connectedEthAddress);

      setConnectWalletClicked(false);
    })();
  }, [ethInfo, connectedEthAddress, connectWalletClicked]);

  useEffect(() => {
    if (isMyProfile && !ethInfo?.address) {
      toastInfo('Connect your ETH Wallet to Earn Rewards.', {
        onClick: handleConnectWallet
      });
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
        <ProfilePicture src={avatar} alt={username}>
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
              {isLoggedIn && !isMyProfile && <FollowButton userId={id} />}
            </FlexBox>
          </FlexBox>
          <FlexBox gap={2} flexDirection="column">
            <FlexBox columnGap={1}>
              {!isMobile && (
                <Chip
                  label={`${username}`}
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
                    isUpdatingEthAddress ? (
                      <CircularProgress
                        size={15}
                        sx={{ verticalAlign: 'middle' }}
                        color="inherit"
                      />
                    ) : (
                      'Connect Wallet'
                    )
                  }
                  disabled={isUpdatingEthAddress}
                  clickable
                  onClick={handleConnectWallet}
                />
              )}
              {!isMobile && twitterInfo?.username && (
                <Chip
                  icon={<FontAwesomeIcon icon={faTwitter} />}
                  label={`${twitterInfo.username}`}
                  clickable
                  component="a"
                  href={twitterUrl(twitterInfo.username)}
                  target="_blank"
                />
              )}
              {!isMobile && !isMyProfile && ethInfo?.address && (
                <Chip
                  icon={<FontAwesomeIcon size="12" icon={faComment} />}
                  label="Chat"
                  clickable
                  component="a"
                  href={blockscanUrl(ethInfo.address)}
                  target="_blank"
                />
              )}
            </FlexBox>
            <FlexBox alignItems="center" gap={2}>
              <FlexBox alignItems="baseline">
                <Typography variant="body2" sx={{ mr: 0.75 }}>
                  <YupCountUp end={yupScore} duration={0.5} useEasing={false} />
                </Typography>
                <Typography variant="body2" sx={{ mr: 0 }}>
                  Yup Score
                </Typography>
              </FlexBox>
              <FlexBox alignItems="baseline">
                <YupCountUp
                  end={influence}
                  duration={0.5}
                  useEasing={false}
                  sx={{ mr: 0.75 }}
                />
                <Typography variant="body2">Influence</Typography>
              </FlexBox>
              {}
            </FlexBox>
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
}

export default ProfileHeader;
