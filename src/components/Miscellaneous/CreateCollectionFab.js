import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import withStyles from '@mui/styles/withStyles';
import { CollectionDialog } from '../Collections';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../contexts/AuthContext';

const styles = (theme) => ({
  collectionFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(5),
    zIndex: '1000',
    color: theme.palette.M100,
    backgroundColor: theme.palette.M800,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
});

function CreateCollectionFab({ classes }) {
  const { open: openAuthModal } = useAuthModal();
  const { isLoggedIn } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    if (!isLoggedIn) {
      openAuthModal({ noRedirect: true });
    } else {
      setDialogOpen(true);
    }
  };
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <>
      {isLoggedIn && (
        <CollectionDialog
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      )}
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleDialogOpen}
        className={classes.collectionFab}
        size="large"
      >
        <AddIcon />
      </IconButton>
    </>
  );
}

CreateCollectionFab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateCollectionFab);
