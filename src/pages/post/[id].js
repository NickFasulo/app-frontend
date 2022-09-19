import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import PostDisplay from '../../components/Post/PostDisplay';
import { CreateCollectionFab } from '../../components/Miscellaneous';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import YupPageHeader from '../../components/YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import FeedCategoryList from '../../components/FeedContainer/FeedCategoryList';
import { YupPageWrapper, YupContainer } from '../../components/styles';
import GridLayout from '../../components/GridLayout';
import { usePost } from '../../hooks/queries';
import { REACT_QUERY_KEYS } from '../../constants/enum';
import callYupApi from '../../apis/base_api';
import PostHead from '../../components/Heads/PostHead';
import PageLoadingBar from '../../components/PageLoadingBar';

function PostDetails() {
  const router = useRouter();
  const { windowScrolled } = useAppUtils();
  const { id } = router.query;
  const { isLoading, data: post } = usePost(id);

  if (isLoading) {
    return <PageLoadingBar />;
  }

  // TODO: Redirect to 404
  if (!post) return null;

  return (
    <ErrorBoundary>
      <PostHead post={post} />
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled} noborder>
          <YupContainer>
            <Typography variant="h5">Post</Typography>
          </YupContainer>
        </YupPageHeader>
        <YupContainer>
          <GridLayout
            contentLeft={<PostDisplay post={post} />}
            contentRight={<FeedCategoryList />}
          />
          <CreateCollectionFab />
        </YupContainer>
      </YupPageWrapper>
    </ErrorBoundary>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const qc = new QueryClient();

  await qc.prefetchQuery([REACT_QUERY_KEYS.POST, id], () => {
    if (!id) return null;

    return callYupApi({
      url: `/posts/post/${id}`
    });
  });

  return {
    props: {
      dehydratedState: dehydrate(qc)
    }
  };
}

export default PostDetails;
