import { useRecommendation } from '../../hooks/queries';
import { FlexBox } from '../styles';
import RecommendedCollections from '../Collections/RecommendedCollections';

function RecommendationList({ collection }) {
  const { name, description, _id: id } = collection;
  const { data: recommendation } = useRecommendation({ name, description, id });

  if (!recommendation) return null;

  return (
    <FlexBox flexDirection="column" className="Tour-RecommendedCollections">
      {recommendation
        .filter((post) => !!post)
        .map((post) => (
          <RecommendedCollections key={post._id} collection={post} />
        ))}
    </FlexBox>
  );
}

export default RecommendationList;
