import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchPosts } from '../../hooks/queries';
import PostController from '../Post/PostController';
import FeedLoader from '../FeedLoader/FeedLoader';

function RecommendedPosts({ query, excludeIds }) {
  const { hasNextPage, fetchNextPage, data, isLoading } = useSearchPosts(query);

  if (isLoading) {
    return <FeedLoader />;
  }

  const posts = data.pages.flat().filter((item) => !!item);

  return (
    <InfiniteScroll
      loader={<FeedLoader />}
      scrollThreshold="300px"
      dataLength={posts.length}
      hasMore={hasNextPage}
      next={fetchNextPage}
    >
      {posts.map((post) =>
        (excludeIds || []).includes(post._id.postid) ? null : (
          <PostController key={post._id.postid} post={post} hideInteractions />
        )
      )}
    </InfiniteScroll>
  );
}

export default RecommendedPosts;
