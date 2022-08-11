import { useSearchPeople } from '../../hooks/queries';
import { List, Typography } from '@mui/material';
import UserRecommendedConnection from '../UserRecommendedConnection';

const UserNewConnections = ({ profile }) => {
  const people = useSearchPeople(profile.bio, 6);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Who to follow
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
};

export default UserNewConnections;
