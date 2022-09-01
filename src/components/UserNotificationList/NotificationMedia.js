import ReactPlayer from 'react-player/lazy';
import YupImage from '../YupImage';
import { FlexBox } from '../styles';

function NotificationMedia({ url }) {
  const isVideo = url?.includes('nft.mp4');

  return (
    <FlexBox width={50} height={50} justifyContent="center">
      {isVideo ? (
        <ReactPlayer
          url={url}
          playing
          muted
          height={50}
          width={50}
          loop
          playsinline
          style={{
            maxWidth: '100%',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        />
      ) : (
        <YupImage
          src={url}
          style={{
            maxWidth: '100%',
            height: 50,
            borderRadius: 8
          }}
        />
      )}
    </FlexBox>
  );
}

export default NotificationMedia;
