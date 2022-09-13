import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Chip,
  Divider,
  Grid,
  Icon,
  Stack,
  styled,
  Typography
} from '@mui/material';
import {
  faLink,
  faPlus,
  faFlag,
  faStar
} from '@fortawesome/pro-regular-svg-icons';
import useAccount from '../../hooks/useAccount';
import ThumbnailIcon from '../CustomWeb3PostEmbed/ThumbnailIcon';
import VoteComp from '../VoteComp/VoteComp';
import { useFollowers } from '../../hooks/queries';
import FollowUser from '../FollowUser';

const Card = styled(Grid)(({ theme }) => ({
  border: `1.5px solid ${theme.palette.M700}22`,
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: `${theme.palette.M850}AA`,
  backdropFilter: 'blur(24px)',
  boxShadow: `0px 0px 30px 0px ${theme.palette.M900}44, 0px 0px 0.75px  ${theme.palette.M900}66`,
  backgroundSize: 'cover',
  minWidth: 0,
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
function PostCard({ post }) {
  const { account } = useAccount();
  const id = account?._id?.id;
  const followers = useFollowers(id) || [];
  console.log({ account, followers });
  return (
    <Card>
      <Grid container direction="column">
        <Grid item>
          <Grid container direction="column" rowSpacing={4}>
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
            {/* <Grid item sx={{
                            background: " linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)",
                            border: "1px solid",
                            borderImageSource: "linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)"

                        }} /> */}
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <YupChip
                        avatar={
                          <ThumbnailIcon
                            protocol={post?.web3Preview?.protocol}
                          />
                        }
                        label={<YupLabel variant="body2">Source</YupLabel>}
                        component="a"
                        href={post.url}
                        clickable
                      />
                    </Grid>

                    <Grid item>
                      <YupChip
                        avatar={
                          <FontAwesomeIcon
                            style={{ width: '20px', height: '20px' }}
                            icon={faLink}
                          />
                        }
                        label={
                          <YupLabel variant="body2">Some other link</YupLabel>
                        }
                        component="a"
                        href="#basic-chip"
                        clickable
                      />
                    </Grid>

                    <Grid item>
                      <YupChip
                        avatar={
                          <FontAwesomeIcon
                            style={{ width: '20px', height: '20px' }}
                            icon={faPlus}
                          />
                        }
                        label={<YupLabel variant="body2">Collect</YupLabel>}
                        component="a"
                        href="#basic-chip"
                        clickable
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <YupChip
                        avatar={
                          <FontAwesomeIcon
                            style={{ width: '16px', height: '16px' }}
                            icon={faFlag}
                          />
                        }
                        label={<YupLabel variant="body2">Report</YupLabel>}
                        clickable
                      />
                    </Grid>
                    <Grid item>
                      <YupChip
                        avatar={
                          <FontAwesomeIcon
                            style={{ width: '20px', height: '20px' }}
                            icon={faStar}
                          />
                        }
                        label={
                          <YupLabel variant="body2">Something else</YupLabel>
                        }
                        clickable
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h6">Relevant People</Typography>
                </Grid>
                <Grid item>
                  <FollowUser userId={id} />
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
