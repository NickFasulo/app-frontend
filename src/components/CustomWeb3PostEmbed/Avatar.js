import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_TWITTER_PROF = '/images/default-twitter-prof.png';

function Avatar({ classes, user, tweetType, hideBird, url }) {
  let userAvatar;
  if (tweetType === 'retweet') {
    userAvatar = classes.retweetUserAvatar;
  } else if (tweetType === 'reply') {
    userAvatar = classes.userAvatar;
  } else {
    userAvatar = classes.userAvatar;
  }

  const addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_TWITTER_PROF;
  };

  return (
    <div className={classes.header}>
      <img
        className={userAvatar}
        src={url || DEFAULT_TWITTER_PROF}
        alt="user"
        onError={addDefaultSrc}
      />
    </div>
  );
}
Avatar.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tweetType: PropTypes.string.isRequired,
  hideBird: PropTypes.bool.isRequired
};

export default Avatar;
