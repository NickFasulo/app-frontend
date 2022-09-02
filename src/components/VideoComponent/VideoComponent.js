import ReactPlayer from 'react-player/lazy';
import { styled } from '@mui/material';

const StyledReactPlayer = styled(ReactPlayer)(({ theme }) => ({
  '& iframe': {
    borderRadius: 10
  }
}));

function VideoComponent({ url }) {
  return <StyledReactPlayer url={url} controls width="100%" />;
}

export default VideoComponent;
