import ReactPlayer from 'react-player/lazy';
import { styled } from '@mui/material';

const StyledReactPlayer = styled(ReactPlayer)(({ theme }) => ({
  '& iframe': {
    borderRadius: 10
  }
}));

const VideoComponent = ({ url }) => {
  return (
    <StyledReactPlayer
      url={url}
      controls
      width="100%"
    />
  );
};

export default VideoComponent;
