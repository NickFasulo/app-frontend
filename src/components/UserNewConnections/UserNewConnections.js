import { List, Typography } from '@mui/material';
import { useSearchPeople, useYupAccount } from '../../hooks/queries';
import UserRecommendedConnection from '../UserRecommendedConnection';

function UserNewConnections({ username }) {
  const { data: profile } = useYupAccount(username);
  const { data: people } = useSearchPeople(profile?.bio, 6);

  if (!profile || !people) return null;

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        People to follow
      </Typography>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {people.map((connection) =>
          connection.username !== profile.username ? (
            <UserRecommendedConnection
              key={connection.username}
              user={connection}
            />
          ) : null
        )}
      </List>
    </>
  );
}

export default UserNewConnections;
