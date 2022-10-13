import { Box, Typography } from '@mui/material';
import { useYupAccount } from '../../hooks/queries';
import { FlexBox, ProfilePicture } from '../styles';
import Link from '../Link';
import { getInitial } from '../../utils/helpers';
import FollowButton from '../FollowButton';
import { levelColors } from '../../utils/colors';

function FollowUser({ userId, noBorder }) {
  const { data: userProfile } = useYupAccount(userId);

  if (!userProfile) return null;

  const { fullname, username, avatar, quantile } = userProfile;

  return (
    <FlexBox gap={{ xs: 1, lg: 1.5 }} alignItems="center">
      <ProfilePicture
        src={avatar}
        alt={`${fullname || username}'s profile picture`}
        size="md"
        border={!noBorder && levelColors[quantile || 'none']}
      >
        {getInitial(username)}
      </ProfilePicture>
      <Link
        href={`/account/${username}`}
        style={{
          flexGrow: 1
        }}
      >
        <Typography>{username || userId}</Typography>
      </Link>
      <Box>
        <FollowButton userId={userId} />
      </Box>
    </FlexBox>
  );
}

export default FollowUser;
