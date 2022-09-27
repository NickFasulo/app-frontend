import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, IconButton, Popover, Typography } from '@mui/material';
import { faChevronUp, faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useYupAccount } from '../../hooks/queries';
import PostChips from '../PostChips/PostChips';
import VoteComp from '../VoteComp/VoteComp';
import PostCard from '../PostCard/PostCard';
import { StyledPopover } from './StyledPopover';
import { firstLetterUpperCase } from '../../utils/helpers';

export default function MobilePostHeader({ post, scrolled }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { username } = useAuth();
  const account = useYupAccount(username);
  console.log({ open })
  return (
    <Grid container direction="column" rowSpacing={2}>
      <Grid item>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container alignItems="center" columnSpacing={1}>
              <img
                src={`/images/icons/${post?.web3Preview?.protocol}.svg`}
                height="32"
                alt={`${post?.web3Preview?.protocol} post`}
              />
              <Grid item>
                <Typography
                  variant="h5"
                  color="M100"
                  sx={{ letterSpacing: '0.02em' }}
                >
                  {firstLetterUpperCase(post?.web3Preview?.protocol)} Post
                </Typography>
              </Grid>
              {scrolled && (
                <Grid item>
                  <IconButton onClick={handleClick}>
                    {open ? (
                      <FontAwesomeIcon icon={faChevronUp} />) : (
                      <FontAwesomeIcon icon={faChevronDown} />)}
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
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
        </Grid>
      </Grid>
      {!scrolled && (
        <Grid item>
          <PostChips post={post} />
        </Grid>
      )}
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <PostCard post={post} withoutVotecomp relevantLength={3} />
      </StyledPopover>
    </Grid>
  );
}
