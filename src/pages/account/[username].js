import { useRouter } from 'next/router';
import ProfileHeader from '../../components/ProfileHeader';
import {
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupPageWrapper
} from '../../components/styles';
import { useSocialLevel, useUserCollections } from '../../hooks/queries';
import { LOADER_TYPE } from '../../constants/enum';
import withSuspense from '../../hoc/withSuspense';
import { useEffect, useState } from 'react';
import YupPageTabs from '../../components/YupPageTabs';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import UserPosts from '../../components/UserPosts';
import useDevice from '../../hooks/useDevice';
import { levelColors } from '../../utils/colors';
import UserCollectionsSection from '../../components/UserCollectionsSection/UserCollectionsSection';
import YupPageHeader from '../../components/YupPageHeader';
import UserAnalytics from '../../components/UserAnalytics/UserAnalytics';
import GridLayout from '../../components/GridLayout';
import UserNewConnections from '../../components/UserNewConnections';
import { Box, Button, Typography } from '@mui/material';
import Link from '../../components/Link';
import YupHead from '../../components/YupHead';
import RecommendedPosts from '../../components/RecommendedPosts';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  ANALYTICS: 'analytics',
  COLLECTIONS: 'collections',
  PEOPLE: 'people'
};

const UserAccountPage = () => {
  const { query } = useRouter();
  const { username } = query;
  const { isMobile } = useDevice();
  const profile = useSocialLevel(username);
  const collections = useUserCollections(profile?._id);
  const { windowScrolled } = useAppUtils();

  const [selectedTab, setSelectedTab] = useState(PROFILE_TAB_IDS.PROFILE);

  useEffect(() => {
    // If `Collections` or `People` tab is selected in Desktop mode, switch it to `Profile` tab.
    if (!isMobile && (
      selectedTab === PROFILE_TAB_IDS.COLLECTIONS ||
        selectedTab === PROFILE_TAB_IDS.PEOPLE
    )) {
      setSelectedTab(PROFILE_TAB_IDS.PROFILE);
    }
  }, [isMobile, selectedTab]);

  if (!username) return null;

  // If profile doesn't exist, shows error message
  if (!profile) {
    return (
      <FlexBox
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        gap={2}
      >
        <Typography variant="h6">
          Sorry, the profile does not exist.
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          href="/"
          sx={{
            width: 200
          }}
        >
          Go to Home
        </Button>
      </FlexBox>
    );
  }

  const { avatar, quantile } = profile;
  const tabs = [
    { label: 'Profile', value: PROFILE_TAB_IDS.PROFILE },
    { label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS }
  ];

  if (isMobile) {
    if (collections.length > 0) {
      tabs.push({ label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS });
    } else {
      tabs.push({ label: 'People', value: PROFILE_TAB_IDS.PEOPLE });
    }
  }

  return (
    (
      <>
        <YupHead
          title={`${profile.username} | Yup`}
          description={`${profile.fullname || profile.username}'s Profile`}
        />
        <YupPageWrapper>
          <YupPageHeader scrolled={windowScrolled}>
            <ProfileHeader profile={profile} hidden={isMobile && windowScrolled} />
            <YupPageTabs
              tabs={tabs}
              value={selectedTab}
              onChange={setSelectedTab}
              hidden={!isMobile && windowScrolled}
              endComponent={
                windowScrolled && (
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
                )
              }
            />
          </YupPageHeader>
          {selectedTab === PROFILE_TAB_IDS.PROFILE && (
            <YupContainer>
              <GridLayout
                contentLeft={(
                  <>
                    <UserPosts userId={profile._id} />
                    <Typography variant="h6" sx={{ my: 3 }}>
                      Recommended
                    </Typography>
                    <RecommendedPosts query={`${profile.fullname} ${profile.username} ${profile.bio}`} />
                  </>
                )}
                contentRight={
                  collections.length > 0 ? (
                    <UserCollectionsSection collections={collections} />
                  ) : (
                    <UserNewConnections profile={profile} />
                  )
                }
              />
            </YupContainer>
          )}
          {selectedTab === PROFILE_TAB_IDS.COLLECTIONS && (
            <YupContainer sx={{ pt: 3 }}>
              <UserCollectionsSection collections={collections} />
            </YupContainer>
          )}
          {selectedTab === PROFILE_TAB_IDS.PEOPLE && (
            <YupContainer sx={{ pt: 3 }}>
              <UserNewConnections profile={profile} />
            </YupContainer>
          )}
          {selectedTab === PROFILE_TAB_IDS.ANALYTICS && (
            <YupContainer sx={{ py: 3 }}>
              <UserAnalytics username={username} />
            </YupContainer>
          )}
        </YupPageWrapper>
      </>
    )
  );
};

export default withSuspense(LOADER_TYPE.TOP_BAR)(UserAccountPage);
