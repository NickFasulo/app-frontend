import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { YupInput, LoaderButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';
import { generateCollectionUrl } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import { useRouter } from 'next/router';
import callYupApi from '../../apis/base_api';
import { queryClient } from '../../config/react-query';
import { REACT_QUERY_KEYS } from '../../constants/enum';

const TITLE_LIMIT = 30;
const DESC_LIMIT = 140;
``;
function CollectionDuplicateDialog({
  collection,
  dialogOpen,
  handleDialogClose
}) {
  const [description, setDescription] = useState(collection.description);
  const [name, setName] = useState(collection.name);
  const { authInfo, userId } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const { push } = useRouter();
  const { isLoading, mutate } = useMutation(
    (data) =>
      callYupApi({
        url: '/collections',
        method: 'POST',
        data
      }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          [REACT_QUERY_KEYS.USER_COLLECTIONS, userId],
          (oldData) => (oldData ? [data, ...oldData] : undefined)
        );

        toastSuccess(`Successfully duplicated ${data.name}`, {
          onClick: () => push(generateCollectionUrl(data.name, data._id))
        });

        handleDialogClose();
      },
      onError: () => toastError('Failed to duplicate the collections.')
    }
  );

  const handleNameChange = ({ target }) => setName(target.value);
  const handleDescriptionChange = ({ target }) => setDescription(target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !!name) handleCreateNewCollection();
  };

  const handleCreateNewCollection = () => {
    const postId = collection.postIds.filter((n) => n);
    mutate({ name, description, postId, ...authInfo });
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
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired
};

export default CollectionDuplicateDialog;
