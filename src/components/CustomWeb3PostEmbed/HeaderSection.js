import React from 'react';
import { Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';
import { timeSince } from './Util/Util';
import Link from '../Link';

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
  createdAt
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

  const accountLink = `farcaster://profiles/${address}/posts`;
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
      <Grid item className={web3PostIcon} 
      >
        <Link href={tweetLink} target="_blank" underline="none" sx={{display:'flex'}}>
          <img
            src={`/images/icons/${
              protocol === 'lens' ? 'lens' : 'farcaster'
            }.svg`}
            height={isMobile ? '12' : '16'}
            alt="🖼️"
          />
        </Link>
      </Grid>
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
