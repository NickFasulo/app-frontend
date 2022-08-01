import React from 'react';
import FeedHOC from '../Feed/FeedHOC';
import FeedHeader from './FeedHeader';
import { YupContainer, YupPageWrapper } from '../styles';
import YupPageHeader from '../YupPageHeader';
import { Typography } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import RecommendationList from '../CollectionDetails/RecommendationList';
import GridLayout from '../GridLayout';

const FeedContainer = ({ categoryData }) => {
  const { windowScrolled } = useAppUtils();

  return (
    <YupPageWrapper>
      <YupPageHeader noborder>
        <YupContainer>
          <FeedHeader isMinimize={windowScrolled} categoryData={categoryData} />
        </YupContainer>
      </YupPageHeader>
      <YupContainer sx={{ pt: 3 }}>
        <GridLayout
          contentLeft={<FeedHOC feedType={categoryData.id} />}
          contentRight={
            <>
              <Typography variant="h5" sx={{ pb: 3 }}>
                Collections
              </Typography>
              <RecommendationList collection={{ name: categoryData.title }} />
            </>
          }
        />
      </YupContainer>
    </YupPageWrapper>
  );
};

export default FeedContainer;
