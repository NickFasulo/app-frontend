import { YupContainer } from '../styles';
import { useState } from 'react';
import CollectionHeader from './CollectionHeader';
import CollectionList from './CollectionList';
import useDevice from '../../hooks/useDevice';
import { useCollection } from '../../hooks/queries';
import RecommendationList from './RecommendationList';
import { Box, Grid, Typography } from '@mui/material';
import YupHead from '../YupHead';
import YupPageHeader from '../../components/YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import {
  YupPageWrapper
} from '../../components/styles';
import YupPageTabs from '../../components/YupPageTabs';
import { LOADER_TYPE } from '../../constants/enum';
import withSuspense from '../../hoc/withSuspense';
import GridLayout from '../GridLayout';

const COLLECTION_TAB_IDS = {
  FEED: 'feed',
  RECOMMENDATION: 'recommendation'
};

const CollectionDetails = ({ id }) => {
  const { isDesktop } = useDevice();
  const collection = useCollection(id);
  const { windowScrolled } = useAppUtils();
  const [selectedTab, setSelectedTab] = useState(COLLECTION_TAB_IDS.FEED);

  const isTabMode = !isDesktop;

  return (
    <>
      <YupHead
        title={`${collection.name} | ${collection.owner}`}
        description={collection.description}
        image={collection.coverImgSrc}
        meta={{
          'twitter:title': `${collection.name} | ${collection.owner}`,
          'twitter:image': collection.coverImgSrc,
          'twitter:description': collection.description
        }}
      />
      <YupPageWrapper>
        <YupPageHeader>
          <CollectionHeader collection={collection} minimized={windowScrolled} />
          <YupPageTabs
            tabs={[
              { label: 'Feed', value: COLLECTION_TAB_IDS.FEED },
              { label: 'Recommended', value: COLLECTION_TAB_IDS.RECOMMENDATION }
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
            hidden={!isTabMode}
          />
        </YupPageHeader>
        <YupContainer>
          {isTabMode ? (
            selectedTab === COLLECTION_TAB_IDS.FEED ? (
              <CollectionList collection={collection} />
            ) : (
              <RecommendationList collection={collection} />
            )
          ) : (
            <GridLayout
              contentLeft={<CollectionList collection={collection} />}
              contentRight={(
                <>
                  <Typography variant="h5" sx={{ pb: 3 }}>
                    Recommended
                  </Typography>
                  <RecommendationList collection={collection} />
                </>
              )}
            />
          )}
        </YupContainer>
      </YupPageWrapper>
    </>
  );
};

export default withSuspense(LOADER_TYPE.TOP_BAR)(CollectionDetails);
