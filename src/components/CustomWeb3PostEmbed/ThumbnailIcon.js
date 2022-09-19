import useDevice from '../../hooks/useDevice';

function ThumbnailIcon({ protocol }) {
  console.log({ protocol });
  const { isMobile } = useDevice();

  return (
    <img
      src={`/images/icons/${protocol}.svg`}
      height={isMobile ? '12' : '16'}
      alt={`${protocol} post`}
    />
  );
}

export default ThumbnailIcon;
