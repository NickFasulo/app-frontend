import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import { addUserCollection } from '../../redux/actions';
import { YupInput, LoaderButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';
import { apiBaseUrl } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';

const TITLE_LIMIT = 30;
const DESC_LIMIT = 140;

function CollectionDialog({ postid, dialogOpen, handleDialogClose }) {
  const dispatch = useDispatch();
  const { authInfo, userId } = useAuth();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const handleNameChange = ({ target }) => setName(target.value);
  const handleDescriptionChange = ({ target }) => setDescription(target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !!name) handleCreateNewCollection();
  };
  const handleCreateNewCollection = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const postId = postid === 'routeFromUrl' ? undefined : postid;
      const params = {
        name,
        description,
        postId,
        eosname: authInfo.eosname,
        ...authInfo
      };
      const { data } = await axios.post(`${apiBaseUrl}/collections`, params);
      dispatch(addUserCollection(userId, data));
      toastSuccess(`Succesfully created ${name}`);
      handleDialogClose();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toastError(`There was a problem creating your collection`);
    }
  };

  return (
    <YupDialog
      headline="New Collection"
      description=" Start here to make a new collection. You can add any content, person, URL, address, NFT or anything else."
      buttonPosition="full"
      open={dialogOpen}
      onClose={handleDialogClose}
      onKeyDown={handleKeyDown}
      firstButton={
        <LoaderButton
          onClick={handleCreateNewCollection}
          fullWidth
          buttonText="Create Collection"
          isLoading={isLoading}
          variant="contained"
          color="primary"
        />
      }
    >
      <Grid container direction="column" alignItems="stretch" spacing={2}>
        <Grid item>
          <YupInput
            fullWidth
            id="name"
            maxLength={TITLE_LIMIT}
            label="Name"
            onChange={handleNameChange}
            type="text"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item>
          <YupInput
            fullWidth
            id="description"
            maxLength={DESC_LIMIT}
            label="Description"
            multiline
            rows={2}
            onChange={handleDescriptionChange}
            type="textarea"
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </YupDialog>
  );
}

CollectionDialog.propTypes = {
  postid: PropTypes.string.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired
};

export default CollectionDialog;
