import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { reactionIcons } from '../../config';
import { TruncateText } from '../styles';

const styles = (theme) => ({
  text: {
    display: 'inline-block',
    color: theme.palette.M100,
    margin: 0
  },
  icon: {
    height: '15px',
    width: '15px',
    position: 'relative',
    filter: 'brightness(0) invert(1)',
    top: '3px'
  },
  arrow: {
    fontSize: '15px',
    position: 'relative',
    top: '3px'
  },
  dotdotdot: {
    whiteSpace: 'normal',
    color: theme.palette.M100,
    width: '100%',
    lineHeight: '20px'
  }
});

const ICONS = reactionIcons;

function NotifText(props) {
  const { notif, invokerWeight, underlineColor, invoker, classes } = props;
  if (!notif) {
    return null;
  }

  const notifVotes = notif.votes ? notif.votes.slice(0, 3) : [];

  if (notif.action === 'vote' && notifVotes.length !== 0) {
    return (
      <ErrorBoundary>
        <TruncateText lines={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; {notif.like ? 'liked' : 'disliked'} &nbsp;
          <FontAwesomeIcon
            icon={notifVotes[0].like ? faThumbsUp : faThumbsDown}
          />
          &nbsp;
          <em>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : (notif.post && notif.post.url) || 'Post data null'}
          </em>
        </TruncateText>
      </ErrorBoundary>
    );
  }
  if (notif.action === 'vote') {
    return (
      <ErrorBoundary>
        <TruncateText lines={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; {notif.like ? 'liked' : 'disliked'} &nbsp;
          <FontAwesomeIcon icon={notif.like ? faThumbsUp : faThumbsDown} />
          &nbsp;
          <em>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : (notif.post && notif.post.url) || 'Post data null'}
          </em>
        </TruncateText>
      </ErrorBoundary>
    );
  }
  if (notif.action === 'comment') {
    return (
      <ErrorBoundary>
        <TruncateText lines={3} className={classes.dotdotdot}>
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; commented on &nbsp;
          <i>
            {notif.post && notif.post.previewData
              ? notif.post.previewData.title
              : notif.post.url}
          </i>
        </TruncateText>
      </ErrorBoundary>
    );
  }
  if (notif.action === 'circle') {
    return (
      <ErrorBoundary>
        <TruncateText
          lines={2}
          className={classes.dotdotdot}
          style={{ color: 'white' }}
        >
          <p
            className={classes.text}
            style={
              invokerWeight !== 0
                ? {
                    textDecoration: 'underline',
                    textDecorationColor: underlineColor
                  }
                : null
            }
          >
            {invoker}
          </p>
          &nbsp; followed you.
        </TruncateText>
      </ErrorBoundary>
    );
  }
  if (notif.action === 'update') {
    return (
      <ErrorBoundary>
        <TruncateText
          lines={2}
          className={classes.dotdotdot}
          style={{ color: 'white' }}
        >
          <p className={classes.text}>{notif.message}</p>
        </TruncateText>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <TruncateText lines={2} className={classes.dotdotdot}>
        <p
          className={classes.text}
          style={
            invokerWeight !== 0
              ? {
                  textDecoration: 'underline',
                  textDecorationColor: underlineColor
                }
              : null
          }
        >
          {invoker}
        </p>
        &nbsp; were rewarded {notif.quantity.toFixed(4)} YUP.
      </TruncateText>
    </ErrorBoundary>
  );
}

NotifText.propTypes = {
  classes: PropTypes.object.isRequired,
  notif: PropTypes.object.isRequired,
  invokerWeight: PropTypes.object.isRequired,
  underlineColor: PropTypes.object.isRequired,
  invoker: PropTypes.object.isRequired
};

export default withStyles(styles)(NotifText);
