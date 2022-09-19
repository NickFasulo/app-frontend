import { useCollection } from '../../hooks/queries';
import {
  LeaderboardItemThumbnailImage,
  LeaderboardItemThumbnailRoot
} from './styles';

function CollectionThumbnail({ url }) {
  const segments = url.split('/');
  const { data: collection } = useCollection(segments[5]);

  return (
    <LeaderboardItemThumbnailRoot>
      <LeaderboardItemThumbnailImage src={collection?.images || []} />
    </LeaderboardItemThumbnailRoot>
  );
}

export default CollectionThumbnail;
