import React from 'react';
import { Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from '../Link';
import ThumbnailIcon from './ThumbnailIcon';
import { timeSince } from '../../utils/post_helpers';

const HeaderSection = ({
  classes,
  name,
  handle,
  address,
  protocol,
  tweetType,
  tweetLink,
  hideBird,
  replyParentUsername,
  createdAt,
  meta
}) => {
  let web3PostIcon;

  if (tweetType === 'retweet') {
    web3PostIcon = classes.retweetweb3PostIcon;
  } else if (tweetType === 'reply') {
    web3PostIcon = classes.web3PostIcon;
  } else {
    if (hideBird === true) {
      web3PostIcon = classes.retweetweb3PostIcon;
    } else {
      web3PostIcon = classes.web3PostIcon;
    }
  }

  let thumbnailLink;

  if (protocol === 'farcaster' && meta?.merkleRoot) {
    thumbnailLink = `farcaster://casts/${meta.merkleRoot}/${meta.merkleRoot}`;
  }

  const accountLink = protocol === 'lens'
    ? `https://lenster.xyz/u/${handle}`
    : `farcaster://profiles/${address}/posts`;
  const isMobile = window.innerWidth <= 600;

  //const formattedVoteTime = moment(createdAt, 'x').fromNow(true);
  return (
    <Grid
      container
      direction="row"
      className={classes.header}
      justifyContent="space-between"
      alignItems="start"
      spacing={0}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          spacing={1}
          className={classes.userTags}
        >
          <Grid item>
            <Link href={accountLink} target="_blank" underline="none">
              <Typography variant="body1" style={{ maxWidth: '300px' }}>
                {name?.substring(0, 80) || ''}
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href={accountLink} target="_blank" underline="none">
              <Typography variant="body2" className={classes.userHandle}>
                @{handle}
              </Typography>
            </Link>
          </Grid>
        </Grid>
        {replyParentUsername && (
          <Grid item>
            <Typography
              variant="body2"
              className={classes.userHandle}
              sx={{ fontStyle: 'italic' }}
            >
              {'Replied to @' + replyParentUsername}
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid item>
        <Grid container alignItems={'center'} spacing={1}>
          <Grid item
            sx={{marginBottom: '0.09375rem'}}>
            <Typography
                    variant="bodyS2"
                    className={classes.userHandle}
                  >
                    { timeSince(new Date(createdAt)) }
            </Typography>
          </Grid>
              {!hideBird && (
        <Grid
          item
          className={web3PostIcon}
          sx={{
            display: 'flex'
          }}
        >
          {thumbnailLink ? (
            <Link href={thumbnailLink} target="_blank" style={{ display: 'flex' }}>
              <ThumbnailIcon protocol={protocol} />
            </Link>
          ) : (
            <ThumbnailIcon protocol={protocol} />
          )}
      </Grid>)}
      </Grid>

        </Grid>
    </Grid>
  );
};

HeaderSection.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tweetType: PropTypes.string.isRequired,
  tweetLink: PropTypes.string.isRequired,
  hideBird: PropTypes.bool.isRequired
};

export default HeaderSection;
