import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import DraggableCollectionPostItem from './DraggableCollectionPostItem';
import { LoaderButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';
import { apiBaseUrl } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const styles = (theme) => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  dialogContentText: {
    root: {
      paddingBottom: '2rem',
      paddingTop: '2rem'
    }
  },
  snack: {
    justifyContent: 'center'
  }
});

function CollectionReorderDialog({
  collection,
  dialogOpen,
  handleDialogClose
}) {
  const { authInfo } = useAuth();
  const [posts, setPosts] = useState(collection?.posts || []);
  const [isLoading, setIsLoading] = useState(false);

  if (!collection.posts) return null;

  const onDragEndHandler = ({ destination, source }) => {
    if (!destination) return;
    const [removed] = posts.splice(source.index, 1);
    posts.splice(destination.index, 0, removed);
    setPosts(posts);
  };

  const handleCollectionReorder = async () => {
    try {
      setIsLoading(true);
      const params = {
        postIds: posts.map((post) => post && post._id.postid).reverse(),
        ...authInfo
      };
      await axios.put(`${apiBaseUrl}/collections/${collection._id}`, params);
      setIsLoading(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <YupDialog
      headline="Reorder"
      buttonPosition="full"
      open={dialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="form-dialog-title"
      firstButton={
        <LoaderButton
          onClick={handleCollectionReorder}
          buttonText="Save"
          isLoading={isLoading}
          variant="contained"
          color="primary"
          size="medium"
        />
      }
    >
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {posts.map((post, index) => (
                <DraggableCollectionPostItem
                  post={post}
                  index={index}
                  key={post && post._id.postid}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </YupDialog>
  );
}

CollectionReorderDialog.propTypes = {
  collection: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired
};

export default memo(withStyles(styles)(CollectionReorderDialog));
