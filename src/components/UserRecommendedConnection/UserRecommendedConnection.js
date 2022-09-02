import {
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled
} from '@mui/material';
import { ConnectionAvatar } from '../styles';
import Link from '../Link';
import FollowButton from '../FollowButton';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.M800}A6`,
  border: `solid 1.5px ${theme.palette.M700}22`,
  borderRadius: 12,
  padding: theme.spacing(1.5),
  backdropFilter: 'blur(24px)'
}));

function UserRecommendedConnection({ user }) {
  return (
    <StyledListItemButton
      component={Link}
      alignItems="center"
      href={`/account/${user.username}`}
    >
      <ListItemAvatar sx={{ mr: 1.5 }}>
        <ConnectionAvatar src={user.avatar} alt={user.fullname}>
          {user.username[0].toUpperCase()}
        </ConnectionAvatar>
      </ListItemAvatar>
      <ListItemText
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }}
        primary={user.fullname || user.username}
      />
      <Box flexGrow={0}>
        <FollowButton userId={user.eosname} />
      </Box>
    </StyledListItemButton>
  );
}

export default UserRecommendedConnection;
