import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import callYupApi from '../../apis/base_api';
import { useFetchFeed } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';

const FeedHOC = ({ feedType }) => {
  const classes = useStyles();
  const [postLength, setPostLength] = useState(0);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage,  hasPreviousPage, status } = useFetchFeed({feedType:feedType});
 console.log({ data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, hasPreviousPage, status})
 const calcPostLength = () => {
  if (data) {
    data.pages.map((page) => {
      setPostLength(postLength + page.length)
    })
  }
}
  useMemo(() => {
    calcPostLength()
  }, [data]);

  const handleFetchNext= () => {
    fetchNextPage();
  }
  // Fetches initial posts, if there are none
  // const fetchPosts = () => {
  //   if (!feedInfo) {
  //     return;
  //   }

  //   const { posts, limit } = feedInfo;

  //   if (posts.length < limit) {
  //     dispatch(fetchFeed(feedType, 0, limit));
  //   }
  // };

  // // Increases start value, to fetch next posts
  // const fetchPostsScroll = () => {
  //   const { start, limit } = feedInfo;

  //   // If start is zero, fetchPosts is called. Temporary solution.
  //   if (!start) {
  //     return;
  //   }

  //   dispatch(fetchFeed(feedType, start, limit));
  // };

  useEffect(() => {
    const element = document.querySelector('.infinite-scroll-component');

    if (element) {
      element.scrollTop = 0;
    }

   // fetchPosts();
    logPageView(feedType);
  }, [feedType]);


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
        next={()=>handleFetchNext()}
        endMessage={<p className={classes.resetScroll}>end of feed</p>}
        scrollThrshold="300px"
      >
        {data.pages.map((page) => (
            <React.Fragment key={page.nextId}>
              {page.map((post) => (
                <PostController
                  key={post._id.postid}
                  post={post}
                  renderObjects
                />
              ))}
              </React.Fragment>
              ))}
      </InfiniteScroll>
    </ErrorBoundary>
  );
};

export default withSuspense()(FeedHOC);
