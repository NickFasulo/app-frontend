import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import PostDisplay from '../../components/Post/PostDisplay';
import { CreateCollectionFab } from '../../components/Miscellaneous';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import YupPageHeader from '../../components/YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import { YupPageWrapper, YupContainer } from '../../components/styles';
import GridLayout from '../../components/GridLayout';
import { usePost } from '../../hooks/queries';
import PostHead from '../../components/Heads/PostHead';
import PostCard from '../../components/PostCard/PostCard';
import useDevice from '../../hooks/useDevice';
import PageLoadingBar from '../../components/PageLoadingBar';
import { postEvent } from '../../apis/general';
import { useAuth } from '../../contexts/AuthContext';
import MobilePostHeader from '../../components/PostPageHeader/MobilePostHeader';
import { firstLetterUpperCase } from '../../utils/helpers';

function PostDetails() {
  const router = useRouter();
  const { authInfo, isLoggedIn } = useAuth();
  const { windowScrolled } = useAppUtils();
  const { isMobile } = useDevice();
  const { id } = router.query;
  const { isLoading, data: post } = usePost(id);
  const [eventSent, setEventSent] = useState(false);
  useEffect(() => {
    if (isLoggedIn && !eventSent) {
      setEventSent(true);
      postEvent({
        eventData: { postId: id },
        eventType: 'view-post',
        accountId: authInfo.eosname,
        ...authInfo
      });
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <PageLoadingBar />;
  }

  // TODO: Redirect to 404
  if (!post) return null;

  return (
    <ErrorBoundary>
      <PostHead post={post} />
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled}>
          <YupContainer sx={{ padding: (theme) => theme.spacing(3) }}>
            {isMobile ? (
              <MobilePostHeader post={post} scrolled={windowScrolled} />
            ) : (
              <Grid container alignItems="center" columnSpacing={1}>
                <img
                  src={`/images/icons/${post?.web3Preview?.protocol}.svg`}
                  height={isMobile ? '32 ' : '32'}
                  alt={`${post?.web3Preview?.protocol} post`}
                />
                <Grid item>
                  <Typography
                    variant="h5"
                    color="M100"
                    sx={{ letterSpacing: '0.02em' }}
                  >
                    {firstLetterUpperCase(post?.web3Preview?.protocol)} Post
                  </Typography>
                </Grid>
              </Grid>
            )}
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

export default PostDetails;
