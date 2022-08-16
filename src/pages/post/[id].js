import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../config';
import { PageBody } from '../../_pages/pageLayouts';
import { Grid, Typography } from '@mui/material';
import PostDisplay from '../../components/Post/PostDisplay';
import { CreateCollectionFab } from '../../components/Miscellaneous';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import YupPageHeader from '../../components/YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import FeedCategoryList from '../../components/FeedContainer/FeedCategoryList';
import {
  YupPageWrapper,
  YupContainer
} from '../../components/styles';
import GridLayout from '../../components/GridLayout';


const PostDetails = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { windowScrolled } = useAppUtils();

  const { id } = router.query;

  const fetchPost = async () => {
    try {
      const postData = (await axios.get(`${apiBaseUrl}/posts/post/${id}`)).data;
      setIsLoading(false);
      setPost(postData);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <ErrorBoundary>
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled} noborder>
          <YupContainer>
            <Typography variant='h5'>
                Post
              </Typography>
          </YupContainer>
        </YupPageHeader>
        <YupContainer>
          <GridLayout
            contentLeft={
              <PostDisplay isLoading={isLoading} post={post} />
            }
            contentRight={<FeedCategoryList/>}
          />
          <CreateCollectionFab />
        </YupContainer>
      </YupPageWrapper>
    </ErrorBoundary>
  );
};

export default PostDetails;
