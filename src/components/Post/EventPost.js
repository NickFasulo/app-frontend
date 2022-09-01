import React, { memo } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import EventPreview from '../EventPreview/EventPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    alignItems: 'center'
  }
});

function EventPost(props) {
  const { previewData, url, classes, postHOC: PostHOC, web3Preview } = props;
  function PreviewComp(_props) {
    return (
      <div className={classes.postContainer}>
        <EventPreview
          description={web3Preview && web3Preview.meta.event.description}
          image={previewData && previewData.img}
          title={web3Preview && web3Preview.title}
          eventImg={web3Preview && web3Preview.meta.event.image_url}
          eventSite={web3Preview && web3Preview.meta.event.event_url}
          creator={web3Preview.creator && web3Preview.creator.address}
          creatorENS={web3Preview.creator && web3Preview.creator.ens}
          url={url}
          createdAt={web3Preview.createdAt}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <PostHOC component={PreviewComp} {...props} />
    </ErrorBoundary>
  );
}

EventPost.propTypes = {
  previewData: PropTypes.object,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
};

export default memo(withStyles(styles)(EventPost));
