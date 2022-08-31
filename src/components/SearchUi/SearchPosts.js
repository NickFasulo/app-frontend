import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo } from 'react';
import { useSearchPosts } from '../../hooks/queries';
import PostController from '../Post/PostController';
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE } from '../../constants/enum';
import FeedLoader from '../FeedLoader/FeedLoader';

function SearchPosts({ searchQuery }) {
  const { hasNextPage, fetchNextPage, data } = useSearchPosts(searchQuery);

  const posts = useMemo(
    () => data.pages.flat().filter((item) => !!item),
    [data]
  );

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

export default withSuspense(LOADER_TYPE.FEED)(SearchPosts);
