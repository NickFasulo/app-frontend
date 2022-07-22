import React  from 'react';
import FeedHOC from '../Feed/FeedHOC';
import FeedHeader from './FeedHeader';
import { YupContainer, YupPageWrapper } from '../styles';
import YupPageHeader from '../YupPageHeader';
import { Grid } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';

const FeedContainer = ({ categoryData }) => {
  const { windowScrolled } = useAppUtils();

  return (
    <YupPageWrapper>
      <YupPageHeader noborder>
        <FeedHeader isMinimize={windowScrolled} categoryData={categoryData} />
      </YupPageHeader>
      <YupContainer sx={{ pt: 3 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={7}>
            <FeedHOC feedType={categoryData.id}/>
          </Grid>
        </Grid>
      </YupContainer>
    </YupPageWrapper>
  );
};

export default FeedContainer;
