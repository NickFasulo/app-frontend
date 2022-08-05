import { Box, ListItemAvatar, ListItemButton, ListItemText, styled } from '@mui/material';
import { ConnectionAvatar } from '../styles';
import FollowButton from '../Followers/FollowButton';
import Link from '../Link';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.M900}88`,
  border: `solid 1px ${theme.palette.M750}`,
  borderRadius: 16,
  padding: theme.spacing(1.5)
}));

const UserRecommendedConnection = ({ user }) => {
  return (
    <StyledListItemButton
      component={Link}
      href={`/account/${user.username}`}
    >
      <ListItemAvatar sx={{ mr: 2.5 }}>
        <ConnectionAvatar src={user.avatar} alt={user.fullname}>
          {user.username[0].toUpperCase()}
        </ConnectionAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={user.fullname || user.username}
      />
      <Box flexGrow={0}>
        <FollowButton
          eosname={user.eosname}
          isLoggedIn={false}
        />
      </Box>
    </StyledListItemButton>
  );
};

export default UserRecommendedConnection;
