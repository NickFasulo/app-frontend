import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchPosts } from '../../hooks/queries';
import PostController from '../Post/PostController';
import FeedLoader from '../FeedLoader/FeedLoader';

function SearchPosts({ searchQuery }) {
  const { hasNextPage, fetchNextPage, data, isLoading } =
    useSearchPosts(searchQuery);

  if (isLoading) {
    return <FeedLoader />;
  }

  const posts = data.pages.flat().filter((item) => !!item);

  return (
    <InfiniteScroll
      loader={<FeedLoader />}
      scrollThreshold={0.7}
      dataLength={posts.length}
      hasMore={hasNextPage}
      next={fetchNextPage}
      scrollableTarget="search-ui-container"
    >
      {posts.map((post) => (
        <PostController key={post._id.postid} post={post} hideInteractions />
      ))}
    </InfiniteScroll>
  );
}

export default SearchPosts;
