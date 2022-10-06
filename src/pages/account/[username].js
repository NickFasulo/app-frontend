import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import ProfileHeader from '../../components/ProfileHeader';
import {
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupPageWrapper
} from '../../components/styles';
import { useYupAccount, useUserCollections } from '../../hooks/queries';
import { REACT_QUERY_KEYS } from '../../constants/enum';
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
import Link from '../../components/Link';
import YupHead from '../../components/YupHead';
import RecommendedPosts from '../../components/RecommendedPosts';
import UserWallet from '../../components/UserWallet';
import callYupApi from '../../apis/base_api';
import { useAuth } from '../../contexts/AuthContext';
import { COMPANY_NAME } from '../../constants/const';
import { getAbsolutePath } from '../../utils/helpers';
import PageLoadingBar from '../../components/PageLoadingBar';
import { postEvent } from '../../apis/general';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  ANALYTICS: 'analytics',
  COLLECTIONS: 'collections',
  PEOPLE: 'people',
  WALLET: 'wallet'
};

function UserAccountPage() {
  const { query } = useRouter();
  const { username } = query;
  const { isMobile } = useDevice();
  const { authInfo, isLoggedIn } = useAuth();
  const { isLoading: isLoadingProfile, data: profile } =
    useYupAccount(username);
  const { isLoading: isFetchingCollections, data: collections = [] } =
    useUserCollections(profile?._id);
  const { windowScrolled } = useAppUtils();
  const { username: loggedInUsername } = useAuth();
  const [eventSent, setEventSent] = useState(false);

  const [selectedTab, setSelectedTab] = useState(PROFILE_TAB_IDS.PROFILE);

  useEffect(() => {
    if (isLoggedIn && !eventSent) {
      setEventSent(true);
      postEvent({
        eventData: { accountId: profile?._id },
        eventType: 'view-account',
        accountId: authInfo.eosname,
        ...authInfo
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // If `Collections` or `People` tab is selected in Desktop mode, switch it to `Profile` tab.
    if (
      !isMobile &&
      (selectedTab === PROFILE_TAB_IDS.COLLECTIONS ||
        selectedTab === PROFILE_TAB_IDS.PEOPLE)
    ) {
      setSelectedTab(PROFILE_TAB_IDS.PROFILE);
    }
  }, [isMobile, selectedTab]);

  if (!username) return null;

  if (isLoadingProfile) {
    return <PageLoadingBar />;
  }

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
        <Typography variant="h6">Sorry, the profile does not exist.</Typography>
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

  const { avatar, quantile, ethInfo } = profile;
  const isMyProfile = username === loggedInUsername;
  const tabs = [{ label: 'Profile', value: PROFILE_TAB_IDS.PROFILE }];

  if (isMyProfile && ethInfo?.address) {
    tabs.push({ label: 'Wallet', value: PROFILE_TAB_IDS.WALLET });
  }

  if (isMyProfile) {
    tabs.push({ label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS });
  }

  if (isMobile) {
    if (collections.length > 0) {
      tabs.push({ label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS });
    } else {
      tabs.push({ label: 'People', value: PROFILE_TAB_IDS.PEOPLE });
    }
  }

  const arrName = profile.fullname ? profile.fullname.split(' ') : [];

  return (
    <>
      <YupHead
        title={`${profile.fullname || profile.username} | ${COMPANY_NAME}`}
        description={`${
          profile.fullname || profile.username
        }'s profile at ${COMPANY_NAME}. ${profile.bio}`}
        metaOg={{
          url: getAbsolutePath(`/account/${profile.username}`),
          type: 'profile'
        }}
        metaOther={{
          'profile:username': profile.username,
          'profile:first_name': arrName.length > 0 ? arrName[0] : undefined,
          'profile:last_name':
            arrName.length > 1 ? arrName[arrName.length - 1] : undefined
        }}
        metaTwitter={{
          card: 'summary'
        }}
      />
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled}>
          <ProfileHeader
            profile={profile}
            hidden={isMobile && windowScrolled}
          />
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
              contentLeft={
                <UserPosts
                  userId={profile._id}
                  name={`${profile.fullname} ${profile.username} ${profile.bio}`}
                />
              }
              contentRight={
                (isFetchingCollections || collections.length) > 0 ? (
                  <UserCollectionsSection collections={collections} />
                ) : (
                  <UserNewConnections username={username} />
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
            <UserNewConnections username={username} />
          </YupContainer>
        )}
        {selectedTab === PROFILE_TAB_IDS.ANALYTICS && (
          <YupContainer sx={{ py: 3 }}>
            <UserAnalytics username={username} />
          </YupContainer>
        )}
        {selectedTab === PROFILE_TAB_IDS.WALLET && (
          <YupContainer>
            <UserWallet ethAddress={ethInfo?.address} />
          </YupContainer>
        )}
      </YupPageWrapper>
    </>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;
  const qc = new QueryClient();

  await qc.prefetchQuery([REACT_QUERY_KEYS.ACCOUNT, username], () =>
    callYupApi({
      url: `/accounts/${username}`
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(qc)
    }
  };
}

export default UserAccountPage;
