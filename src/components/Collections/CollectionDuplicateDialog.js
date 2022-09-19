import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUserCollection } from '../../redux/actions';
import { YupInput, LoaderButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';
import { apiBaseUrl } from '../../config';
import { generateCollectionUrl } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import { useRouter } from 'next/router';

const TITLE_LIMIT = 30;
const DESC_LIMIT = 140;

function CollectionDuplicateDialog({
  collection,
  dialogOpen,
  handleDialogClose
}) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState(collection.description);
  const [name, setName] = useState(collection.name);
  const [isLoading, setIsLoading] = useState(false);
  const { authInfo, userId } = useAuth();
  const { toastSuccess } = useToast();
  const { push } = useRouter();

  const handleNameChange = ({ target }) => setName(target.value);
  const handleDescriptionChange = ({ target }) => setDescription(target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !!name) handleCreateNewCollection();
  };

  const handleCreateNewCollection = async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      const postId = collection.postIds.filter((n) => n);
      const params = { name, description, postId, ...authInfo };
      const { data } = await axios.post(`${apiBaseUrl}/collections`, params);
      dispatch(addUserCollection(userId, data));
      toastSuccess(`Succesfully duplicated ${name}`, {
        onClick: () => push(generateCollectionUrl(data.name, data._id))
      });
      handleDialogClose();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <YupDialog
        headline="Duplicate Collection"
        description="Start here to duplicate the collection."
        buttonPosition="full"
        open={dialogOpen}
        onClose={handleDialogClose}
        onKeyDown={handleKeyDown}
        firstButton={
          <LoaderButton
            onClick={handleCreateNewCollection}
            fullWidth
            buttonText="Duplicate"
            isLoading={isLoading}
            variant="contained"
            color="secondary"
          />
        }
      >
        <Grid container direction="column" alignItems="stretch" spacing={3}>
          <Grid item>
            <YupInput
              fullWidth
              id="name"
              maxLength={TITLE_LIMIT}
              multiline
              label="Name"
              onChange={handleNameChange}
              type="text"
              variant="outlined"
              size="small"
              value={name}
            />
          </Grid>
          <Grid item>
            <YupInput
              fullWidth
              id="description"
              maxLength={DESC_LIMIT}
              label="Description"
              multiline
              onChange={handleDescriptionChange}
              type="text"
              variant="outlined"
              size="small"
              value={description}
            />
          </Grid>
        </Grid>
      </YupDialog>
    </>
  );
}

CollectionDuplicateDialog.propTypes = {
  collection: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired
};

export default CollectionDuplicateDialog;
