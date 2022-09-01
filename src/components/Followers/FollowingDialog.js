import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { connect } from 'react-redux';
import YupDialog from '../Miscellaneous/YupDialog';
import FollowUser from '../FollowUser';

function FollowingDialog({
  open,
  onClose,
  followings
}) {
  return (
    <ErrorBoundary>
      <YupDialog
        headline="Following"
        buttonPosition="right"
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        aria-labelledby="customized-dialog-title"
      >
        <Grid container direction="column">
          {!followings?.length ? (
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              No users are being followed
            </Typography>
          ) : (
            followings.map((followingUser) => (
              <FollowUser userId={followingUser} />
            ))
          )}
        </Grid>
      </YupDialog>
    </ErrorBoundary>
  );
}
)
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
