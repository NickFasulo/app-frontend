import React  from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { Divider, Fade, Typography } from '@mui/material';
import PostHeader from '../PostHeader/PostHeader';
import PostGrid from '../PostGrid/PostGrid';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  post: {
    background: 'transparent',
    paddingBottom: '0.75rem',
    width: '100%',
    userSelect: 'none'
  },
  article: {
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: `${theme.palette.M900}80`,
    backdropFilter: 'blur(24px)',
    boxShadow: `0px 0px 10px 0px ${theme.palette.M200}05, 0px 0px 0.75px  ${theme.palette.M200}05`,
    backgroundSize: 'cover',
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      border: '0px solid',
      backgroundColor: `${theme.palette.M850}00`,
      backdropFilter: 'blur(0px)',
      boxShadow: 'none'
    }
  },
  postUrlHeader: {
    width: '100%',
    padding: '4px 16px 16px 16px',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    [theme.breakpoints.down('md')]: {
      padding: '4px 8px 8px 4px'
    },
    [theme.breakpoints.down('sm')]: {
      zoom: '100%'
    }
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  }
});

const PostHOC = (props) => {
  const {
    classes,
    author,
    url,
    votes,
    postid,
    weights,
    quantiles,
    postType,
    hideInteractions,
    rating,
    post,
    component: Component
  } = props;

  return (
    <ErrorBoundary>
      <Fade in timeout={400}>
        <div className={classes.post}>
          {!hideInteractions && (
            <PostHeader
              postid={postid}
              postType={postType}
              hideInteractions={hideInteractions}
              author={author}
            />
          )}
          <div className={classes.article}>
            <Component {...props} />
            <Typography className={classes.postUrlHeader} variant="h6">
              <PostGrid
                post={post}
                postid={postid}
                url={url}
                quantiles={quantiles}
                votes={votes}
                weights={weights}
                postType={postType}
                rating={rating}
              />
            </Typography>
          </div>
          <Divider
            className={classes.divider}
            style={{ backgroundColor: '#ffffff05' }}
            variant="fullWidth"
          />
        </div>
      </Fade>
    </ErrorBoundary>
  );
};

PostHOC.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  votes: PropTypes.number.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  hideInteractions: PropTypes.bool,
  component: PropTypes.element.isRequired,
  postType: PropTypes.string,
  rating: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default withStyles(styles)(PostHOC);
