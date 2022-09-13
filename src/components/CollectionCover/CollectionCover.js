/* eslint-disable prettier/prettier */
import { styled } from '@mui/material';
import { FlexBox } from '../styles';
import { useCollection } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';
import YupImage from '../YupImage';

const CoverImageItem = styled(YupImage)(() => ({
  flexGrow: 1,
  flexShrink: 1,
  height: '100%',
  objectFit: 'cover'
}));

function CollectionCover({ id }) {
  const { images } = useCollection(id) || {};

  return (
    <FlexBox width="100%" height="100%">
      {(images || []).map((img) => (
        <CoverImageItem
          key={img}
          src={img}
          alt="Collection Cover"
          style={{
            width: `${100 / images.length}%`
          }}
        />
      ))}
    </FlexBox>
  );
}

export default withSuspense()(CollectionCover);
