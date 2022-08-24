import { useUserPosts } from '../../hooks/queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListSkeleton from '../ListSkeleton/ListSkeleton';
import { useMemo } from 'react';
import flatten from 'lodash/flatten';
import PostController from '../Post/PostController';
import { Typography } from '@mui/material';

const UserPosts = ({ userId }) => {
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
    return (
      <Typography variant="h6">
        User has no posts.
      </Typography>
    );
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
        <PostController
          key={post._id.postid}
          post={post}
          renderObjects
          hideInteractions
        />
      ))}
    </InfiniteScroll>
  );
};

export default UserPosts;
