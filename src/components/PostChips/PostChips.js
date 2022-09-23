import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, Grid, styled, Typography } from '@mui/material';
import {
  faLink,
  faPlus,
  faFlag,
  faStar
} from '@fortawesome/pro-regular-svg-icons';
import { CollectionPostMenu } from '../Collections';
import ThumbnailIcon from '../CustomWeb3PostEmbed/ThumbnailIcon';

import { useYupAccount } from '../../hooks/queries';
import { useAuth } from '../../contexts/AuthContext';

const YupChip = styled(Chip)(({ theme }) => ({
  padding: '1rem 0.5rem'
}));
const YupLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.M400
}));
export default function PostChips({ post }) {
  const { username } = useAuth();
  const account = useYupAccount(username);
  const protocol = post?.web3Preview?.protocol
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <YupChip
              avatar={<ThumbnailIcon protocol={protocol} />}
              label={<YupLabel variant="body2">{protocol.charAt(0).toUpperCase() + protocol.slice(1)}</YupLabel>}
              component="a"
              href={post.url}
              clickable
            />
          </Grid>

          {/* <Grid item>
                        <YupChip avatar={<FontAwesomeIcon style={{ width: '20px', height: '20px' }} icon={faLink} />}
                            label={<YupLabel variant='body2' >Some other link</YupLabel>}
                            component="a" href="#basic-chip" clickable />
                    </Grid> */}

          <Grid item>
            <CollectionPostMenu
              noIcon
              accountName={account && account.name}
              postid={post?._id.postid}
            >
              <YupChip
                avatar={
                  <FontAwesomeIcon
                    style={{ width: '20px', height: '20px' }}
                    icon={faPlus}
                  />
                }
                label={<YupLabel variant="body2">Collect</YupLabel>}
                component="a"
                clickable
              />
            </CollectionPostMenu>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item>
                <Grid container spacing={1}>

                    <Grid item>
                        <YupChip avatar={<FontAwesomeIcon style={{ width: '16px', height: '16px' }} icon={faFlag} />} label={<YupLabel variant='body2' >Report</YupLabel>} clickable />
                    </Grid>
                    <Grid item>
                        <YupChip avatar={<FontAwesomeIcon style={{ width: '20px', height: '20px' }} icon={faStar} />} label={<YupLabel variant='body2' >Something else</YupLabel>} clickable />
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
                </Grid>
            </Grid> */}
    </Grid>
  );
}
