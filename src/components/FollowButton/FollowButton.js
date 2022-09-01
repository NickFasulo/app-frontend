import { useAuth } from '../../contexts/AuthContext';
import { useFollowings } from '../../hooks/queries';
import { ActionButton } from '../styles';
import withSuspense from '../../hoc/withSuspense';
import { useMutation } from '@tanstack/react-query';
import { MUTATION_KEYS } from '../../constants/enum';
import { CircularProgress } from '@mui/material';

const FollowButton = ({ userId }) => {
  const { userId: myUserId, isLoggedIn, authInfo } = useAuth();
  const myFollowingUsers = useFollowings(myUserId) || [];
  const isAlreadyFollowing = myFollowingUsers.includes(userId);
  const { isLoading, mutate } = useMutation([MUTATION_KEYS.FOLLOW_UNFOLLOW_USER]);

  // If user's not logged-in, show nothing.
  if (!isLoggedIn) {
    return null;
  }

  const handleFollowOrUnfollow = () => {
    mutate({
      isFollow: !isAlreadyFollowing,
      authUserId: myUserId,
      followUnfollowUserId: userId,
      authInfo
    });
  };

  return (
    <ActionButton
      size="small"
      color="secondary"
      variant="outlined"
      onClick={handleFollowOrUnfollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress size={16} />
      ) : isAlreadyFollowing ? 'Following' : 'Follow'}
    </ActionButton>
  )
};

export default withSuspense()(FollowButton);
