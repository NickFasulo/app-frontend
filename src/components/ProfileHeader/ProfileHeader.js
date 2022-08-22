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
import { useState } from 'react';
import FollowButton from '../Followers/FollowButton';
import EditProfile from '../EditProfile/EditProfile';
import { useAuth } from '../../contexts/AuthContext';
import { useEnsName } from 'wagmi';

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

  const [editModalOpen, setEditModalOpen] = useState(false);

  const isMyProfile = isLoggedIn && authName === id;
  const userColor = levelColors[quantile || 'none'];
  const yupScore = Math.floor(profile.score || 1);

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
                <FollowButton eosname={id} isLoggedIn={false} followings={followings} followers={followers} />
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
