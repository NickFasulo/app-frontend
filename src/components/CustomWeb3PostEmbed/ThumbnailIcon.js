import useDevice from '../../hooks/useDevice';

const ThumbnailIcon = ({ protocol }) => {
  const { isMobile } = useDevice();

  return (
    <img
      src={`/images/icons/${protocol}.svg`}
      height={isMobile ? '12' : '16'}
      alt="Lens post"
    />
  );
};

export default ThumbnailIcon;
