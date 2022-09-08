import InfiniteScroll from 'react-infinite-scroll-component';
import ListSkeleton from '../ListSkeleton';
import PostController from '../Post/PostController';

export default function InfinitePosts({ posts, fetchNextPage, hasNextPage }) {
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<ListSkeleton />}
      scrollThreshold="300px"
    >
      {posts.map((post) => (
        <PostController
          key={post._id.postid}
          post={post}
          renderObjects
          hideInteractions
        />
      ))}
    </InfiniteScroll>
  );
}
