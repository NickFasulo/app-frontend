import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, Divider, Grid, styled, Typography } from '@mui/material';
import {
  faLink,
  faPlus,
  faFlag,
  faStar
} from '@fortawesome/pro-regular-svg-icons';
import removeMd from 'remove-markdown';
import useAccount from '../../hooks/useAccount';
import ThumbnailIcon from '../CustomWeb3PostEmbed/ThumbnailIcon';
import VoteComp from '../VoteComp/VoteComp';
import { useFollowers, useSearchPeople, useYupAccount } from '../../hooks/queries';
import FollowUser from '../FollowUser';
import { useAuth } from '../../contexts/AuthContext';
import { CollectionPostMenu } from '../Collections';
import { parseText } from '../../utils/post_helpers';
import PostChips from '../PostChips/PostChips';

const Card = styled(Grid)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: `${theme.palette.M900}80`,
  backdropFilter: 'blur(24px)',
  boxShadow: `0px 0px 30px 0px ${theme.palette.M900}44, 0px 0px 0.75px  ${theme.palette.M900}66`,
  backgroundSize: 'cover',
  minWidth: 0,
  padding: '20px'
}));
const YupChip = styled(Chip)(({ theme }) => ({
  padding: '1rem 0.5rem'
}));
const YupLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.M400
}));

const StyledIcon = styled(Typography)(({ theme }) => ({
  width: '20px',
  height: '20px'
}));

const YupDivider = styled(Grid)(({ theme }) => ({
  borderWidth: '0 0 1px 0',
  borderStyle: 'solid',
  borderImage: 'linear-gradient(to right, transparent, #7E7C84, transparent) 1'
}));
const getWeb3Likes = (post) => {
  if (post.web3Preview?.protocol === 'farcaster') {
    return post.web3Preview?.meta?.reactions.count;
  }
  if (post.web3Preview?.protocol === 'lens') {
    return post.web3Preview?.meta?.metadata.stats.totalUpvotes;
  }

  return 0;
};

const getWeb3Dislikes = (post) => {
  if (post.web3Preview?.protocol === 'farcaster') {
    return 0;
  }
  if (post.web3Preview?.protocol === 'lens') {
    return post.web3Preview?.meta?.metadata.stats.totalDownvotes;
  }

  return 0;
};
function PostCard({ post }) {
  const { username } = useAuth();
  const account = useYupAccount(username);
  const id = account?._id;
  const parsedText = removeMd(parseText(post.web3Preview.content)).slice(0, 400)
  const { isLoading, data: people } = useSearchPeople(parsedText);
  // Just for showing the data, needs to replaced once backend has "Relevant people" functionality
  const followers = useFollowers(id);
  console.log({ id, account, followers });

  const likes =
    getWeb3Likes(post) +
    getWeb3Dislikes(post) +
    post.rating.overall.ratingCount;
  return (
    <Card>
      <Grid container direction="column">
        <Grid item>
          <Grid container direction="column" rowSpacing={4}>
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <VoteComp
                    postInfo={{ post }}
                    url={post?.url}
                    account={account}
                    postid={post?._id.postid}
                    quantiles={post?.quantiles}
                    rating={post?.rating}
                    weights={post?.weights}
                  />
                </Grid>
                {/* <Grid item>
                  <Typography variant="body1" display="inline">
                    {likes}{' '}
                  </Typography>
                  <Typography variant="body2" display="inline" color="M400">
                    curated this
                  </Typography>
                </Grid> */}
              </Grid>
            </Grid>
            {/* <Grid item sx={{
                            background: " linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)",
                            border: "1px solid",
                            borderImageSource: "linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)"

                        }} /> */}
            <Grid item>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <PostChips post={post} />
                </Grid>

                <YupDivider item />
                <Grid item>
                  <Grid container direction='column' spacing={2}>
                    <Grid item>
                      <Typography variant='h6'>Relevant People</Typography>
                    </Grid>
                    <Grid item>
                      {people?.map((follower) => <FollowUser noBorder userId={follower.userId} />)}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
export default PostCard;
