import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import FollowButton from './FollowButton';
import { levelColors } from '../../utils/colors';
import UserAvatar from '../UserAvatar/UserAvatar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { connect } from 'react-redux';
import { fetchSocialLevel } from '../../redux/actions';
import YupDialog from '../Miscellaneous/YupDialog';

const FollowingDialog = ({ open, onClose, account, followings, levels, dispatch }) => {
  const classes = useStyles();

  return (
    <ErrorBoundary>
      <YupDialog
        headline="Following"
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
          {followings.length === 0 ? (
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              No users are being followed
            </Typography>
          ) : (
            followings.map((user) => {
              const eosname = user;
              if (!levels[eosname]) {
                dispatch(fetchSocialLevel(eosname));
                return <div />;
              }
              if (levels[eosname].isLoading) {
                return <div />;
              }

              const level = levels[eosname];
              const username = level && level.levelInfo.username;
              const quantile = level && level.levelInfo.quantile;
              let socialLevelColor = levelColors[quantile];

              return (
                <Grid item key={user}>
                  <div className={classes.user}>
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
                              src={user.avatar}
                            />
                          </Grid>
                          <Grid item>
                            <Link
                              onClick={onClose}
                              style={{
                                textDecoration: 'none',
                                color: '#ffffff'
                              }}
                              href={`/account/${eosname}`}
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
                          account={account}
                          className={classes.followButton}
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

  const twitterIdentity = localStorage.getItem('twitterMirrorInfo');
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account;
  const { account: ethAccount } = state.ethAuth;
  let account = scatterIdentity || state.ethAccount;

  if (!scatterIdentity) {
    if (ethAccount) {
      account = { name: ethAccount._id, authority: 'active' };
    } else if (twitterIdentity) {
      account = { name: JSON.parse(twitterIdentity).name, authority: 'active' };
    }
  }

  if (account && state.userPermissions && state.userPermissions[account.name]) {
    account.authority = state.userPermissions[account.name].perm;
  }

  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    followingInfo: state.followingByUser[username] || {
      isLoading: true,
      following: [],
      error: false
    }
  };
};

FollowingDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  levels: PropTypes.object,
  followingInfo: PropTypes.object.isRequired,
  account: PropTypes.object
};

export default connect(mapStateToProps)(FollowingDialog);
