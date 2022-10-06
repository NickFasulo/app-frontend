import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';

function TweetVidPlayer({ url }) {
  if (!url) return null;
  return (
    <ReactPlayer
      controls
      url={url}
      width="100%"
      style={{ borderRadius: 12, overflow: 'hidden', maxHeight: '400px' }}
    />
  );
}
TweetVidPlayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default TweetVidPlayer;
