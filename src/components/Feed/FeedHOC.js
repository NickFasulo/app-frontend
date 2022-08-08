import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedLoader from '../FeedLoader/FeedLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchFeed } from '../../redux/actions';

import PostController from '../Post/PostController';
import { Typography } from '@mui/material';

import useStyles from './FeedHOCStyles';
import { logPageView } from '../../utils/analytics';
import clsx from 'clsx';

const FeedHOC = ({ feedType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const feedInfo = useSelector((state) => state.feedInfo?.feeds[feedType]);

  // Fetches initial posts, if there are none
  const fetchPosts = () => {
    if (!feedInfo) {
      return;
    }
    console.log('amlog', 'fetch posts');

    const { posts, limit } = feedInfo;

    if (posts.length < limit) {
      dispatch(fetchFeed(feedType, 0, limit));
    }
  };

  // Increases start value, to fetch next posts
  const fetchPostsScroll = () => {
    const { start, limit } = feedInfo;
    console.log('amlog', 'fetching posts');

    // If start is zero, fetchPosts is called. Temporary solution.
    if (!start) {
      return;
    }

    dispatch(fetchFeed(feedType, start, limit));
  };

  useEffect(() => {
    const element = document.querySelector('.infinite-scroll-component');

    if (element) {
      element.scrollTop = 0;
    }

    fetchPosts();
    logPageView(feedType);
  }, [feedType]);

  const { posts = [], hasMore = false } = feedInfo || {};

  if (!hasMore && posts.length === 0) {
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
        dataLength={posts.length}
        hasMore={hasMore}
        className={clsx(classes.infiniteScroll, 'infinite-scroll-component')}
        loader={
          <div className={classes.feedLoader}>
            <FeedLoader />
          </div>
        }
        next={fetchPostsScroll}
        endMessage={<p className={classes.resetScroll}>end of feed</p>}
      >
        {posts.map((post) => (
          <PostController key={post._id.postid} post={post} renderObjects />
        ))}
      </InfiniteScroll>
    </ErrorBoundary>
  );
};

export default FeedHOC;
