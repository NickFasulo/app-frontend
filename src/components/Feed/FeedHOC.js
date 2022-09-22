import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import sum from 'lodash/sum';
import FeedLoader from '../FeedLoader/FeedLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import PostController from '../Post/PostController';

import useStyles from './FeedHOCStyles';
import { logPageView } from '../../utils/analytics';
import { useFetchFeed } from '../../hooks/queries';
import { useAuth } from '../../contexts/AuthContext';

function FeedHOC({ feedType }) {
  const classes = useStyles();
  const { authInfo } = useAuth();

  const { data, fetchNextPage, isLoading } = useFetchFeed({
    feedType,
    accountId: authInfo.eosname
  });

  const postLength = sum((data?.pages || []).map((page) => page?.length || 0));

  const handleFetchNext = () => {
    fetchNextPage();
  };

  useEffect(() => {
    const element = document.querySelector('.infinite-scroll-component');

    if (element) {
      element.scrollTop = 0;
    }

    // fetchPosts();
    logPageView(feedType);
  }, [feedType]);

  if (isLoading) {
    return <FeedLoader />;
  }

  if (!data) return null;

  if (data.pages.length === 0) {
    return (
      <div align="center">
        <Typography variant="caption" className={classes.noPostsText}>
          No posts found
        </Typography>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <InfiniteScroll
        dataLength={postLength}
        hasMore
        className={clsx(classes.infiniteScroll, 'infinite-scroll-component')}
        loader={
          <div className={classes.feedLoader}>
            <FeedLoader />
          </div>
        }
        next={() => handleFetchNext()}
        endMessage={<p className={classes.resetScroll}>end of feed</p>}
        scrollThrshold="300px"
      >
        {data.pages.map((page) => (
          <React.Fragment key={page.nextId}>
            {page.map((post) => (
              <PostController key={post._id.postid} post={post} renderObjects />
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroll>
    </ErrorBoundary>
  );
}

export default FeedHOC;
