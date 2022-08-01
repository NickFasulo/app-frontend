import numeral from 'numeral';
import { FlexBox } from '../styles';
import NumberText from '../NumberText';
import FollowersDialog from '../Followers/FollowersDialog';
import { useState } from 'react';
import FollowingDialog from '../Followers/FollowingDialog';

const FollowerSection = ({ rating, followers, followings }) => {
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  return (
    <>
      <FlexBox columnGap={2.5}>
        <NumberText
          number={numeral(rating).format('0a').toUpperCase()}
          text="Likes"
        />
        <NumberText
          number={followers?.length || 0}
          text="Followers"
          clickable
          onClick={() => setFollowerOpen(true)}
        />
        <NumberText
          number={followings?.length || 0}
          text="Following"
          clickable
          onClick={() => setFollowingOpen(true)}
        />
      </FlexBox>
      <FollowersDialog
        open={followerOpen}
        onClose={() => setFollowerOpen(false)}
        followers={followers}
      />
      <FollowingDialog
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        followings={followings}
      />
    </>
  );
};

export default FollowerSection;
