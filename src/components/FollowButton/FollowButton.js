import { useMutation } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useFollowings } from '../../hooks/queries';
import { ActionButton } from '../styles';
import { MUTATION_KEYS } from '../../constants/enum';

function FollowButton({ userId }) {
  const { userId: myUserId, isLoggedIn, authInfo } = useAuth();
  const { data: myFollowingUsers } = useFollowings(myUserId) || [];
  const { isLoading, mutate } = useMutation([
    MUTATION_KEYS.FOLLOW_UNFOLLOW_USER
  ]);

  // If user's not logged-in, show nothing.
  if (!isLoggedIn) {
    return null;
  }

  if (!myFollowingUsers) return null;

  const isAlreadyFollowing = myFollowingUsers.includes(userId);

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
      disableRipple
    >
      {isLoading ? (
        <CircularProgress size={16} style={{
          margin: " 0 15px"
        }} />
      ) : isAlreadyFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </ActionButton>
  );
}

export default FollowButton;
