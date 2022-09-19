import { useState } from 'react';
import { Typography } from '@mui/material';
import { YupContainer, YupPageWrapper } from '../styles';
import CollectionHeader from './CollectionHeader';
import CollectionPostList from './CollectionPostList';
import useDevice from '../../hooks/useDevice';
import { useCollection } from '../../hooks/queries';
import RecommendationList from './RecommendationList';
import YupHead from '../YupHead';
import YupPageHeader from '../YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import YupPageTabs from '../YupPageTabs';
import GridLayout from '../GridLayout';
import { COMPANY_NAME } from '../../constants/const';
import { getAbsolutePath } from '../../utils/helpers';
import PageLoadingBar from '../PageLoadingBar';

const COLLECTION_TAB_IDS = {
  FEED: 'feed',
  RECOMMENDATION: 'recommendation'
};

function CollectionDetails({ id }) {
  const { isDesktop } = useDevice();
  const { isLoading: isFetchingCollection, data: collection } =
    useCollection(id);
  const { windowScrolled } = useAppUtils();
  const [selectedTab, setSelectedTab] = useState(COLLECTION_TAB_IDS.FEED);

  const isTabMode = !isDesktop;

  if (isFetchingCollection) {
    return <PageLoadingBar />;
  }

  // TODO: Show error page
  if (!collection) return null;

  return (
    <>
      <YupHead
        title={`${collection.name} by ${collection.owner} | ${COMPANY_NAME}`}
        description={collection.description}
        image={collection.coverImgSrc}
        metaOg={{
          site_name: COMPANY_NAME,
          url: getAbsolutePath(`/collections/${collection.name}/${id}`)
        }}
      />
      <YupPageWrapper>
        <YupPageHeader>
          <CollectionHeader
            collection={collection}
            minimized={windowScrolled}
          />
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
              <CollectionPostList id={id} name={collection.name} />
            ) : (
              <RecommendationList collection={collection} />
            )
          ) : (
            <GridLayout
              contentLeft={
                <CollectionPostList id={id} name={collection.name} />
              }
              contentRight={
                <>
                  <Typography variant="h6" sx={{ pb: 1 }}>
                    Recommended
                  </Typography>
                  <RecommendationList collection={collection} />
                </>
              }
            />
          )}
        </YupContainer>
      </YupPageWrapper>
    </>
  );
}

export default CollectionDetails;
