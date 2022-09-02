import React, { memo } from 'react';
import ReactPlayer from 'react-player/lazy';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    padding: '0.5rem',
    alignItems: 'center',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('md')]: {
      borderRadius: 0
    }
  },
  reactPlayer: {
    width: '100%',
    height: '100%',
    minHeight: '250px',
    zIndex: 50,
    overflow: 'hidden',
    borderRadius: '0.75rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0%',
      marginRight: '0%',
      height: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      maxWidth: '100vw',
      width: '100vw'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '100%',
      maxHeight: '900px'
    }
  }
});

function VideoPost(props) {
  const { classes, url, postHOC: PostHOC } = props;
  const isMobile = window.innerWidth <= 600;
  const heightProp = isMobile ? { height: 0 } : {};

  function VideoComp(_props) {
    return (
      <div className={classes.postContainer}>
        <ReactPlayer
          className={classes.reactPlayer}
          controls
          style={{ overFlow: 'hidden', maxHeight: '1000px' }}
          url={url}
          width="100%"
          {...heightProp}
        />
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <PostHOC component={VideoComp} {...props} />
    </ErrorBoundary>
  );
}

VideoPost.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(withStyles(styles)(VideoPost));
