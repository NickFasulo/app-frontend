import { Typography } from '@mui/material';
import RecommendedPosts from '../RecommendedPosts';
import { useCollectionPosts } from '../../hooks/queries';
import { useMemo } from 'react';
import InfinitePosts from '../InfinitePosts/InfinitePosts';
import { DEFAULT_FEED_PAGE_SIZE } from '../../config';

function CollectionPostList({ id, name }) {
  const { data, hasNextPage, fetchNextPage } = useCollectionPosts(id);

  const posts = useMemo(() => {
    if (!data) return [];

    return data.pages.flat().filter((item) => item?._id.postid);
  }, [data]);

  const isPostAllFetched =
    data.pages?.length > 0 &&
    data.pages[data.pages.length - 1].length < DEFAULT_FEED_PAGE_SIZE;

  return (
    <>
      <InfinitePosts
        posts={posts}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
      {isPostAllFetched && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>
            Recommended
          </Typography>
          <RecommendedPosts query={name} />
        </>
      )}
    </>
  );
}

export default CollectionPostList;
