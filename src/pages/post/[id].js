import { useRouter } from 'next/router';
import React from 'react';
import { Grid, Typography } from '@mui/material';
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
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE, REACT_QUERY_KEYS } from '../../constants/enum';
import callYupApi from '../../apis/base_api';
import PostHead from '../../components/Heads/PostHead';
import PostCard from '../../components/PostCard/PostCard';
import ThumbnailIcon from '../../components/CustomWeb3PostEmbed/ThumbnailIcon';
import useDevice from '../../hooks/useDevice';

function PostDetails() {
  const router = useRouter();
  const { windowScrolled } = useAppUtils();
  const { id } = router.query;
  const post = usePost(id);
  const { isMobile } = useDevice();

  return (
    <ErrorBoundary>
      <PostHead post={post} />
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled}>
          <YupContainer sx={{ padding: (theme) => theme.spacing(3) }}>
            <Grid container alignItems="center" columnSpacing={1}>
              <img
                src={`/images/icons/${post?.web3Preview?.protocol}.svg`}
                height={isMobile ? '42 ' : '56'}
                alt={`${post?.web3Preview?.protocol} post`}
              />
              <Grid item>
                <Grid container direction="column" justifyContent="center">
                  <Typography
                    variant="h5"
                    color="M100"
                    sx={{ letterSpacing: '0.02em' }}
                  >
                    post by {post.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="M100"
                    sx={{ letterSpacing: '0.01em' }}
                  >
                    Curated {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </YupContainer>
        </YupPageHeader>
        <YupContainer>
          <GridLayout
            contentLeft={<PostDisplay post={post} />}
            contentRight={<PostCard post={post} />}
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

export default withSuspense(LOADER_TYPE.TOP_BAR)(PostDetails);
