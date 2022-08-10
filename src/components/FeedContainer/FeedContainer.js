import React from 'react';
import FeedHOC from '../Feed/FeedHOC';
import FeedHeader from './FeedHeader';
import { YupContainer, YupPageWrapper } from '../styles';
import YupPageHeader from '../YupPageHeader';
import { Typography, Fade } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import GridLayout from '../GridLayout';
import FeedCategoryList from './FeedCategoryList';

const FeedContainer = ({ categoryData }) => {
  const { windowScrolled } = useAppUtils();

  return (
    <YupPageWrapper>
      <YupPageHeader noborder>
        <YupContainer>
          <FeedHeader isMinimize={windowScrolled} categoryData={categoryData} />
        </YupContainer>
      </YupPageHeader>
        <Fade in timeout={3000}>
          <YupContainer sx={{ pt: 3 }}>
              <GridLayout
                contentLeft={<FeedHOC feedType={categoryData.id} />}
                contentRight={
                  <>
                      <Typography variant="h6" sx={{ pb: 1 }}>
                        Recommended
                      </Typography>
                      <FeedCategoryList currentCategoryId={categoryData.id} />
                    </>
                }
              />
          </YupContainer>
        </Fade>
    </YupPageWrapper>
  );
};

export default FeedContainer;
