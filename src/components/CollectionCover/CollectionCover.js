import { styled } from '@mui/material';
import { FlexBox } from '../styles';
import { useCollection } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';
import { COLLECTION_COVER_IMAGE_COUNT } from '../../constants/const';
import YupImage from '../YupImage';
import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';

const CoverImageItem = styled(YupImage)(() => ({
  flexGrow: 1,
  flexShrink: 1,
  height: '100%',
  objectFit: 'cover'
}));

function CollectionCover({ id }) {
  const collection = useCollection(id);
  const allImages =
    collection?.posts
      .map((item) => item?.previewData?.img)
      .filter((img) => !!img) || [];
  const coverImages =
    allImages.length === 0
      ? [DEFAULT_IMAGE_PATH]
      : allImages.slice(
          0,
          Math.min(allImages.length, COLLECTION_COVER_IMAGE_COUNT)
        );

  return (
    <FlexBox width="100%" height="100%">
      {coverImages.map((img, idx) => (
        <CoverImageItem
          key={idx}
          src={img}
          alt="Collection Cover"
          style={{
            width: `${100 / coverImages.length}%`
          }}
        />
      ))}
    </FlexBox>
  );
}

export default withSuspense()(CollectionCover);
