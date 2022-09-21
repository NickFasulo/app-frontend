import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo } from 'react';
import flatten from 'lodash/flatten';
import { Typography } from '@mui/material';
import PostController from '../Post/PostController';
import ListSkeleton from '../ListSkeleton/ListSkeleton';
import { useUserPosts } from '../../hooks/queries';

function UserPosts({ userId }) {
  const { data, hasNextPage, status, fetchNextPage } = useUserPosts(userId);

  const posts = useMemo(() => {
    if (!data) return [];

    return flatten(data.pages.map((page) => page.posts)).filter(
      (item) => item?._id.postid
    );
  }, [data]);

  if (status === 'loading') {
    return <ListSkeleton />;
  }

  if (posts.length === 0) {
    return <Typography variant="h6">User has no posts.</Typography>;
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<ListSkeleton />}
      scrollThreshold="300px"
    >
      {posts.map((post) => (
        <article key={post._id.postid}>
          <PostController
            post={post}
            renderObjects
            hideInteractions
          />

        </article>
      ))}
    </InfiniteScroll>
  );
}

export default UserPosts;
