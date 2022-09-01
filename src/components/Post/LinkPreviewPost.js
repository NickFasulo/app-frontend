import React, { memo } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import LinkPreview from '../LinkPreview/LinkPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    alignItems: 'center'
  }
});

function LinkPreviewPost(props) {
  const { previewData, url, classes, postHOC: PostHOC } = props;
  function PreviewComp(_props) {
    return (
      <div className={classes.postContainer}>
        <LinkPreview
          description={previewData && previewData.description}
          image={previewData && previewData.img}
          title={previewData && previewData.title}
          url={url}
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

LinkPreviewPost.propTypes = {
  previewData: PropTypes.object,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
};

export default memo(withStyles(styles)(LinkPreviewPost));
