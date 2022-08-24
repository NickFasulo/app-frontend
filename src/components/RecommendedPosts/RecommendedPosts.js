import { useSearchPosts } from '../../hooks/queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo } from 'react';
import PostController from '../Post/PostController';
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE } from '../../constants/enum';
import FeedLoader from '../FeedLoader/FeedLoader';

const RecommendedPosts = ({ query, excludeIds }) => {
  const { hasNextPage, fetchNextPage, data } = useSearchPosts(query);

  const posts = useMemo(() => {
    return data.pages.flat().filter((item) => !!item);
  }, [data]);

  return (
    <InfiniteScroll
      loader={<FeedLoader />}
      scrollThreshold="300px"
      dataLength={posts.length}
      hasMore={hasNextPage}
      next={fetchNextPage}
    >
      {posts.map((post) => (
        (excludeIds || []).includes(post._id.postid) ? null :
        <PostController key={post._id.postid} post={post} hideInteractions />
      ))}
    </InfiniteScroll>
  );
};

export default withSuspense(LOADER_TYPE.FEED)(RecommendedPosts);
