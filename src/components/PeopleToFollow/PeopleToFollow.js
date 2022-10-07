import { Typography } from '@mui/material';
import { useSearchPeople, useYupAccount } from '../../hooks/queries';
import { FlexBox, YupCard } from '../styles';
import { useAuth } from '../../contexts/AuthContext';
import FollowUser from '../FollowUser';

export default function PeopleToFollow() {
  const { username } = useAuth();
  const { data: profile } = useYupAccount(username);
  const { data: people } = useSearchPeople(profile?.bio, 5);

  if (!profile || !people) return null;

  return (
    <YupCard>
      <Typography variant="h6" sx={{ mb: 2 }}>
        People to Follow
      </Typography>
      <FlexBox flexDirection="column" gap={0.5}>
        {people.map((follower) => (
          <FollowUser key={follower.userId} noBorder userId={follower.userId} />
        ))}
      </FlexBox>
    </YupCard>
  );
}
