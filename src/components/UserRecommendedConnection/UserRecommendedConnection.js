import {
  Box,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled
} from '@mui/material';
import { ConnectionAvatar } from '../styles';
import Link from '../Link';
import FollowButton from '../FollowButton';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.M900}80`,
  boxShadow: `0px 0px 10px 0px ${theme.palette.M200}05, 0px 0px 0.75px  ${theme.palette.M200}05`,
  borderRadius: 12,
  padding: theme.spacing(1.5),
  backdropFilter: 'blur(24px)'
}));

function UserRecommendedConnection({ user }) {
  return (
    <StyledListItemButton alignItems="center">
      <Grid item xs={12}>
        <Link href={`/account/${user.username}`}>
          <Grid container alignItems="center">
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
          </Grid>
        </Link>
      </Grid>
      <Box flexGrow={0}>
        <FollowButton userId={user.userId} />
      </Box>
    </StyledListItemButton>
  );
}

export default UserRecommendedConnection;
