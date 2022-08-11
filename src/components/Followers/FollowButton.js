import React, { Fragment, useState } from 'react';
import { unfollowUser, followUser } from '../../redux/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './styles';
import { parseError } from '../../eos/error';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import axios from 'axios';
import { accountInfoSelector } from '../../redux/selectors';
import { getAuth } from '../../utils/authentication';
import { apiBaseUrl } from '../../config';
import useToast from '../../hooks/useToast';
import { ActionButton } from '../styles';

const FollowButton = ({
  eosname,
  isLoggedIn,
  account,
  followers,
  dispatch
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toastError } = useToast();
  const classes = useStyles();
  const handleFollow = async (accountToFollow) => {
    try {
      if (account == null) {
        toastError('Login to follow user!');
        return;
      }
      setIsLoading(true);

      const auth = await getAuth(account);
      const followData = { account: account.name, accountToFollow, ...auth };

      const followParams = new URLSearchParams(followData).toString();
      await axios.post(`${apiBaseUrl}/v2/followers?${followParams}`);

      await dispatch(followUser(account.name, accountToFollow));
    } catch (err) {
      console.log(parseError(err));
      toastError(parseError(err, 'follow'));
    }

    setIsLoading(false);
  };

  const handleUnfollow = async (accountToUnfollow) => {
    try {
      if (account == null) {
        toastError('Login to unfollow user!');
        return;
      }
      setIsLoading(true);

      const auth = await getAuth(account);
      const followData = { account: account.name, accountToUnfollow, ...auth };

      const followParams = new URLSearchParams(followData).toString();
      await axios.delete(`${apiBaseUrl}/v2/followers?${followParams}`);

      await dispatch(unfollowUser(account.name, accountToUnfollow));
    } catch (err) {
      console.log(parseError(err));
      toastError(parseError(err));
    }

    setIsLoading(false);
  };

  if (isLoggedIn || account == null) {
    return null;
  }
  const isFollowing = followers
    ? followers.some((user) => {
        return user._id.account === account.name;
      })
    : false;

  if (isFollowing) {
    return (
      <ErrorBoundary>
        <Fragment>
          {isLoading ? (
            <CircularProgress
              size={16}
              style={{
                color: 'white',
                marginTop: '3px',
                marginRight: '20px'
              }}
            />
          ) : (
            <ActionButton
              size="small"
              color="secondary"
              variant="outlined"
              className={classes.followButton}
              onClick={() => {
                handleUnfollow(eosname);
              }}
            >
              Following
            </ActionButton>
          )}
        </Fragment>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <Fragment>
          {isLoading ? (
            <CircularProgress
              size={16}
              style={{
                color: 'white',
                marginTop: '3px',
                marginRight: '20px'
              }}
            />
          ) : (
            <ActionButton
              size="small"
              color="secondary"
              variant="outlined"
              className={classes.followButton}
              onClick={() => {
                handleFollow(eosname);
              }}
            >
              Follow
            </ActionButton>
          )}
        </Fragment>
      </ErrorBoundary>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state);

  return {
    account,
    followingInfo: state.followersByUser
  };
};

FollowButton.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  eosname: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  followingInfo: PropTypes.object,
  account: PropTypes.object
};

export default connect(mapStateToProps)(FollowButton);
