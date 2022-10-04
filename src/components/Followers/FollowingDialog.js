import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import YupDialog from '../Miscellaneous/YupDialog';
import FollowUser from '../FollowUser';

function FollowingDialog({ open, onClose, followings }) {
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
            <Typography variant="h6" style={{ textAlign: 'center' }}>
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

export default FollowingDialog;
