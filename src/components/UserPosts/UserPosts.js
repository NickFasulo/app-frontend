import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo } from 'react';
import flatten from 'lodash/flatten';
import { Grid, Typography } from '@mui/material';
import PostController from '../Post/PostController';
import ListSkeleton from '../ListSkeleton/ListSkeleton';
import { useUserPosts } from '../../hooks/queries';
import InfinitePosts from '../InfinitePosts/InfinitePosts';
import RecommendedPosts from '../RecommendedPosts';
import { DEFAULT_FEED_PAGE_SIZE } from '../../config';

function UserPosts({ userId, name }) {
  const { data, hasNextPage, status, fetchNextPage } = useUserPosts(userId);

  const isPostAllFetched =
    data?.pages?.length > 0 &&
    data?.pages[data.pages.length - 1].posts.length < DEFAULT_FEED_PAGE_SIZE;

  const posts = useMemo(() => {
    if (!data) return [];

    return flatten(data.pages.map((page) => page.posts)).filter(
      (item) => item?._id.postid
    );
  }, [data]);

  if (status === 'loading') {
    return <ListSkeleton />;
  }

  return (
    <>
      {posts.length > 0 && (
        <InfinitePosts
          posts={posts}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
      {(isPostAllFetched || posts?.length === 0) && (
        <Grid item>
          <Typography variant="capsized_subtitle1" sx={{ my: 2 }}>
            Recommended
          </Typography>
          <RecommendedPosts query={name} />
        </Grid>
      )}
    </>
  );
}

export default UserPosts;
