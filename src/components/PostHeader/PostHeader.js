import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { levelColors } from '../../utils/colors';
import UserAvatar from '../UserAvatar/UserAvatar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchSocialLevel } from '../../redux/actions';
import { accountInfoSelector } from '../../redux/selectors';
import { apiBaseUrl, yupCreator } from '../../config';
import YupLink from '../YupLink';
import { usePostInteractions, useYupAccount } from '../../hooks/queries';

const styles = (theme) => ({
  interactionBar: {
    opacity: '0.7',
    padding: '0 0 4px 0',
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      padding: '4px 0'
    }
  },
  keyUser: {
    opacity: '80%'
  },
  time: {
    paddingRight: '2px',
    marginLeft: 'auto',
    color: theme.palette.M500,
    fontSize: '14px',
    lineHeight: '14px',
    paddingTop: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  voterOpacity: {
    opacity: '80%'
  },
  avatarImage: {
    fontSize: '14px',
    display: 'grid',
    border: '2px solid',
    borderRadius: '100%',
    width: '22px',
    marginRight: '7px',
    height: '22px'
  }
});

const PostHeader = ({ postid, classes, hideInteractions }) => {
  const postInteractions = usePostInteractions(postid);
  if (!postInteractions?.length > 0) return;
  const vote = postInteractions?.[0];
  const account = useYupAccount(vote?.voter);
  const formattedVoteTime = moment(vote.timestamp, 'x').fromNow(true);

  if (!account) return;

  const voterQuantile = account.quantile;
  const voterLevelColor = voterQuantile
    ? levelColors[voterQuantile]
    : levelColors.sixth;

  const voterAvatar = account.avatar;
  const voterUsername = account.username;

  const voterIsTracked = account.twitterInfo.isTracked;
  const voterIsMirror = account.twitterInfo.isMirror;
  const voterIsAuth = account.twitterInfo.isAuthUser;
  const voterTwitterUsername = account?.twitterInfo?.username || '';

  const headerDisplayName =
    voterIsMirror && voterIsTracked
      ? voterTwitterUsername
      : voterUsername || vote.voter;
  console.log({ account }, voterAvatar);

  const VoterHeader = (props) => (
    <Grid container direction="row" alignItems="center">
      <Grid item className={classes.voterOpacity}>
        <UserAvatar
          alt={voterUsername}
          className={classes.avatarImage}
          src={voterAvatar}
          style={{
            borderColor: voterLevelColor
          }}
          username={voterUsername}
        />
      </Grid>
      <Grid className={classes.keyUser} item>
        <YupLink
          style={{ textDecoration: 'none', color: '#fff' }}
          href={`/account/${voterUsername || vote.voter}`}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            {headerDisplayName}
          </Typography>
        </YupLink>
      </Grid>
      <Grid item>
        {voterIsMirror && !voterIsAuth ? (
          <img
            src="/images/icons/twitter.svg"
            style={{
              height: '0.8rem',
              paddingLeft: '8px',
              paddingRight: '8px',
              display: 'grid'
            }}
            alt="twitter"
          />
        ) : null}
      </Grid>
    </Grid>
  );

  return (
    <ErrorBoundary>
      <div
        className={classes.interactionBar}
        style={hideInteractions ? { marginBottom: '-9px' } : {}}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {' '}
              {hideInteractions ? null : (
                <Grid item>
                  <Grid container direction="row" alignItems="center">
                    <Grid item className={classes.voterOpacity}>
                      <VoterHeader />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid item className={classes.voterOpacity}>
                <FontAwesomeIcon
                  className={classes.voterOpacity}
                  icon={vote.like ? faThumbsUp : faThumbsDown}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.time}>
              {formattedVoteTime}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </ErrorBoundary>
  );
};
PostHeader.propTypes = {
  postid: PropTypes.string.isRequired,
  hideInteractions: PropTypes.bool,
  author: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(PostHeader));
