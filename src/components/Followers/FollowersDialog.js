import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import FollowButton from './FollowButton';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { levelColors } from '../../utils/colors';
import UserAvatar from '../UserAvatar/UserAvatar';
import numeral from 'numeral';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchSocialLevel } from '../../redux/actions';
import { accountInfoSelector } from '../../redux/selectors';
import { YupButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';

const styles = (theme) => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(1.5)
  },
  gridRoot: {
    flexGrow: 1
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: 'black',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  followButton: {
    margin: theme.spacing()
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2)
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: '30px',
    paddingRight: '5%'
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  progress: {
    margin: theme.spacing(2),
    color: '#ffffff'
  },
  Typography: {
    fontFamily: 'Gilroy'
  }
});

const FollowersDialog = ({ open, onClose, account, classes, followers, levels, dispatch }) => {
  return (
    <ErrorBoundary>
      <YupDialog
        headline="Followers"
        buttonPosition="right"
        open={open}
        onClose={onClose}
        className={classes.dialog}
        maxWidth="xs"
        fullWidth
        aria-labelledby="customized-dialog-title"
      >
        <Grid container direction="column">
          {' '}
          {!followers?.length ? (
            <Typography variant="subtitle1">No followers</Typography>
          ) : (
            followers.map((follower) => {
              const eosname = follower._id.account;
              if (!levels[eosname]) {
                dispatch(fetchSocialLevel(eosname));
                return <div />;
              }
              if (levels[eosname].isLoading) {
                return <div />;
              }
              const level = levels[eosname];
              const username = level?.levelInfo?.username;
              const quantile = level?.levelInfo?.quantile;
              let socialLevelColor = levelColors[quantile];

              return (
                <Grid item>
                  <div className={classes.user} key={follower._id}>
                    <Grid
                      alignItems="center"
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Grid
                          alignItems="center"
                          container
                          direction="row"
                          spacing="16"
                        >
                          <Grid item>
                            <UserAvatar
                              username={username || eosname}
                              className={classes.avatarImage}
                              src={follower.avatar}
                            />
                          </Grid>
                          <Grid item>
                            <Link
                              onClick={onClose}
                              style={{
                                textDecoration: 'none',
                                color: 'inherit'
                              }}
                              href={`/account/${follower._id}`}
                            >
                              <Typography
                                style={{
                                  textDecoration: socialLevelColor
                                    ? 'underline'
                                    : 'none',
                                  textDecorationColor: socialLevelColor,
                                  textDecorationStyle: socialLevelColor
                                    ? 'solid'
                                    : 'none',
                                  marginLeft: '1rem'
                                }}
                                variant="caption"
                              >
                                {username || eosname}
                              </Typography>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <FollowButton
                          eosname={eosname}
                          isLoggedIn={account && account.name === eosname}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              );
            })
          )}
        </Grid>
      </YupDialog>
    </ErrorBoundary>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps;
  const account = accountInfoSelector(state);
  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    followersInfo: state.followersByUser[username] || {
      isLoading: true,
      followers: [],
      error: false
    }
  };
};

FollowersDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object,
  levels: PropTypes.object,
  classes: PropTypes.object.isRequired,
  followersInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(FollowersDialog));
