import { useMutation } from '@tanstack/react-query';
import { CircularProgress, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck } from '@fortawesome/pro-regular-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useFollowings } from '../../hooks/queries';
import { ActionButton } from '../styles';
import { MUTATION_KEYS } from '../../constants/enum';
import useDevice from '../../hooks/useDevice';

function FollowButton({ userId }) {
  const { isTinyDesktop } = useDevice();
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
  if (isTinyDesktop) {
    return (
      <IconButton
        size="small"
        onClick={handleFollowOrUnfollow}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={16} />
        ) : isAlreadyFollowing ? (
          <FontAwesomeIcon icon={faUserCheck} />
        ) : (
          <FontAwesomeIcon icon={faUserPlus} />
        )}
      </IconButton>
    );
  }

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
      ) : isAlreadyFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </ActionButton>
  );
}

export default FollowButton;
