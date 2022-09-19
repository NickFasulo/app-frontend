import { useSearchCollections } from '../../hooks/queries';
import { RecommendedCollections } from '../Collections';

const SearchCollections = ({ searchQuery }) => {
  const { data: collections } = useSearchCollections(searchQuery);

  if (!collections) return null;

  return collections.map((collection) => (
    <RecommendedCollections collection={collection} />
  ));
};

export default SearchCollections;
