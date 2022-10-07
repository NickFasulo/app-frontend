import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import { styled } from '@mui/material';

const StyledReactPlayer = styled(ReactPlayer)(({ theme }) => ({
  '& video': {
    width: '100%',
    height: 'auto',
    maxHeight: 400,
    borderRadius: 12
  }
}));

function TweetVidPlayer({ url }) {
  if (!url) return null;
  return <StyledReactPlayer controls url={url} width="100%" height="auto" />;
}
TweetVidPlayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default TweetVidPlayer;
