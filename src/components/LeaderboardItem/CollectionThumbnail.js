import { useCollection } from '../../hooks/queries';
import {
  LeaderboardItemThumbnailImage,
  LeaderboardItemThumbnailRoot
} from './styles';
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE } from '../../constants/enum';

function CollectionThumbnail({ url }) {
  const segments = url.split('/');
  const collection = useCollection(segments[5]) || {};
  const { images } = collection;

  return (
    <LeaderboardItemThumbnailRoot>
      <LeaderboardItemThumbnailImage src={images || []} />
    </LeaderboardItemThumbnailRoot>
  );
}

export default withSuspense(LOADER_TYPE.DEFAULT)(CollectionThumbnail);
