import { Box, Typography } from '@mui/material';
import { useYupAccount } from '../../hooks/queries';
import { FlexBox, ProfilePicture } from '../styles';
import Link from '../Link';
import { getInitial } from '../../utils/helpers';
import FollowButton from '../FollowButton';
import withSuspense from '../../hoc/withSuspense';
import { levelColors } from '../../utils/colors';

function FollowUser({ userId }) {
  const userProfile = useYupAccount(userId);

  if (!userProfile) return null;

  const { fullname, username, avatar, quantile } = userProfile;

  return (
    <FlexBox
      gap={3}
      alignItems="center"
      sx={{ my: 0.5 }}
    >
      <ProfilePicture
        src={avatar}
        alt={`${fullname || username}'s profile picture`}
        size="md"
        border={levelColors[quantile || 'none']}
      >
        {getInitial(username)}
      </ProfilePicture>
      <Link
        href={`/accounts/${username}`}
        style={{
          flexGrow: 1
        }}
      >
        <Typography>
          {username || userId}
        </Typography>
      </Link>
      <Box>
        <FollowButton
          userId={userId}
        />
      </Box>
    </FlexBox>
  );
}

export default withSuspense()(FollowUser);
