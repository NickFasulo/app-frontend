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
import { LOADER_TYPE } from '../../constants/enum';
import withSuspense from '../../hoc/withSuspense';
import GridLayout from '../GridLayout';
import { COMPANY_NAME } from '../../constants/const';
import { getAbsolutePath } from '../../utils/helpers';

const COLLECTION_TAB_IDS = {
  FEED: 'feed',
  RECOMMENDATION: 'recommendation'
};

function CollectionDetails({ id }) {
  const { isDesktop } = useDevice();
  const collection = useCollection(id);
  const { windowScrolled } = useAppUtils();
  const [selectedTab, setSelectedTab] = useState(COLLECTION_TAB_IDS.FEED);

  const isTabMode = !isDesktop;

  if (!collection) {
    // TODO: Replace with NOT FOUND page.
    return <div />;
  }

  return (
    <>
      <YupHead
        title={`${collection.name} by ${collection.owner} | ${COMPANY_NAME}`}
        description={collection.description}
        image={collection.coverImgSrc}
        metaOg={{
          site_name: COMPANY_NAME,
          url: getAbsolutePath(`/collections/${id}`)
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

export default withSuspense(LOADER_TYPE.TOP_BAR)(CollectionDetails);
