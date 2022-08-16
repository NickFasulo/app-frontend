import { useRouter } from 'next/router';
import YupHead from '../../components/YupHead';
import {
  getFeedCategoryWithDefault,
  getFeedCategoryMetaImage
} from '../../services/feeds';
import FeedContainer from '../../components/FeedContainer';

const Feeds = () => {
  const { query } = useRouter();
  const { category } = query;

  const categoryData = getFeedCategoryWithDefault(category);
  const metaImage = getFeedCategoryMetaImage(category);

  return (
    <>
      <YupHead
        title={categoryData.metaTitle}
        description={categoryData.description}
        image={metaImage}
      />
      <FeedContainer categoryData={categoryData} />
    </>
  );
};

export default Feeds;
