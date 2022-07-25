import { useRouter } from 'next/router'
import ProfileHeader from '../../components/ProfileHeader'
import {
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupPageWrapper
} from '../../components/styles'
import { useSocialLevel } from '../../hooks/queries'
import { LOADER_TYPE } from '../../constants/enum'
import withSuspense from '../../hoc/withSuspense'
import { useEffect, useState } from 'react';
import YupPageTabs from '../../components/YupPageTabs';
import { Box, Grid } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import UserPosts from '../../components/UserPosts';
import useDevice from '../../hooks/useDevice';
import { levelColors } from '../../utils/colors';
import UserCollectionsSection from '../../components/UserCollectionsSection/UserCollectionsSection';
import YupPageHeader from '../../components/YupPageHeader';
import UserAnalytics from '../../components/UserAnalytics/UserAnalytics';
import GridLayout from '../../components/GridLayout';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  ANALYTICS: 'analytics',
  COLLECTIONS: 'collections'
}

const UserAccountPage = () => {
  const { query } = useRouter();
  const { username } = query;
  const { isMobile } = useDevice();
  const profile = useSocialLevel(username);
  const { windowScrolled } = useAppUtils();

  const [selectedTab, setSelectedTab] = useState(PROFILE_TAB_IDS.PROFILE);
  const [headerHeight, setHeaderHeight] = useState(null);

  useEffect(() => {
    // If `Collections` tab is selected in Desktop mode, switch it to `Profile` tab.
    if (!isMobile && selectedTab === PROFILE_TAB_IDS.COLLECTIONS) {
      setSelectedTab(PROFILE_TAB_IDS.PROFILE);
    }
  }, [isMobile, selectedTab]);

  if (!username) return null;

  const { avatar, quantile } = profile;
  const tabs = [
    { label: 'Profile', value: PROFILE_TAB_IDS.PROFILE },
    { label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS }
  ];

  if (isMobile) {
    tabs.push({ label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS });
  }

  return (
    <YupPageWrapper>
      <YupPageHeader scrolled={windowScrolled} onChangeHeight={setHeaderHeight}>
        <ProfileHeader
          profile={profile}
          hidden={isMobile && windowScrolled}
        />
        <YupPageTabs
          tabs={tabs}
          value={selectedTab}
          onChange={setSelectedTab}
          hidden={!isMobile && windowScrolled}
          endComponent={ windowScrolled && (
            <FlexBox gap={1} alignItems="center" mr={3}>
              <ProfilePicture
                src={avatar}
                alt={username}
                size="md"
                border={levelColors[quantile || 'none']}
              />
              <GradientTypography variant="h6">
                {profile.fullname}
              </GradientTypography>
            </FlexBox>
          )}
        />
      </YupPageHeader>
      {selectedTab === PROFILE_TAB_IDS.PROFILE && (
        <YupContainer>
          <GridLayout
            headerHeight={headerHeight}
            contentLeft={<UserPosts userId={profile._id} />}
            contentRight={<UserCollectionsSection userId={profile._id} />}
          />
        </YupContainer>
      )}
      {selectedTab === PROFILE_TAB_IDS.COLLECTIONS && (
        <YupContainer sx={{ pt: 3 }}>
          <UserCollectionsSection userId={profile._id} />
        </YupContainer>
      )}
      {selectedTab === PROFILE_TAB_IDS.ANALYTICS && (
        <YupContainer sx={{ py: 3 }}>
          <UserAnalytics username={username}/>
        </YupContainer>
      )}
    </YupPageWrapper>
  )
};

export default withSuspense(LOADER_TYPE.DEFAULT)(UserAccountPage);
