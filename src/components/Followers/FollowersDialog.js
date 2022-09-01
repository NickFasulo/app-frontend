import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import YupDialog from '../Miscellaneous/YupDialog';
import FollowUser from '../FollowUser';

function FollowersDialog({
  open,
  onClose,
  followers,
}) {
  return (
    <ErrorBoundary>
      <YupDialog
        headline="Followers"
        buttonPosition="right"
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        aria-labelledby="customized-dialog-title"
      >
        <Grid container direction="column">
          {!followers?.length ? (
            <Typography variant="subtitle1">No followers</Typography>
          ) : (followers.map((follower) => (
            <FollowUser userId={follower._id.account} />
          ))
          )}
        </Grid>
      </YupDialog>
    </ErrorBoundary>
  );
}

FollowersDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  followers: PropTypes.array.isRequired
};

export default FollowersDialog;
