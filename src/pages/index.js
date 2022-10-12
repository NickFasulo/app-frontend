import { Button, Grid, Typography, Grow, Zoom } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  FlexBox,
  GradientTypography,
  YupCard,
  YupContainer
} from '../components/styles';
import GridLayout from '../components/GridLayout';
import FeedHOC from '../components/Feed/FeedHOC';
import YupLinkCard from '../components/YupLinkCard';
import { useAppLayout } from '../contexts/AppLayoutContext';
import { useAuth } from '../contexts/AuthContext';
import PeopleToFollow from '../components/PeopleToFollow/PeopleToFollow';
import { useThemeMode } from '../contexts/ThemeModeContext';
import useDevice from '../hooks/useDevice';
import { useAppUtils } from '../contexts/AppUtilsContext';
import Link from '../components/Link';
import { landingPageUrl } from '../config';
import { useAuthModal } from '../contexts/AuthModalContext';
import YupHead from '../components/YupHead';
import YupPageHeader from '../components/YupPageHeader';
import YupPageTabs from '../components/YupPageTabs';
import { FEED_CATEGORIES } from '../constants/data';

export default function HomePage() {
  const { isMobile } = useDevice();
  const { isLightMode } = useThemeMode();
  const { setHeaderHeight } = useAppLayout();
  const { isLoggedIn, isCheckingAuth } = useAuth();
  const { windowScrolled } = useAppUtils();
  const { open: openAuthModal } = useAuthModal();
  const [selectedTab, setSelectedTab] = useState(FEED_CATEGORIES.DAILY_HIT.id);

  useEffect(() => {
    import('@lottiefiles/lottie-player');
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isLoggedIn) {
      setHeaderHeight(0);
    }
  }, [isCheckingAuth, isLoggedIn]);

  return (
    <>
      <YupHead
        title="Yup - Web3 Social Network"
        description="Follow your friends's web3 activity, curate top content from your favorite platforms."
        metaOg={{
          site_name: 'Yup',
          site_description: "Follow your friends's web3 activity, curate top content from your favorite platforms."
        }}
      />
      {isLoggedIn && (
        <YupPageHeader sx={{ mb: 0.5 }}>
          <YupPageTabs
            tabs={[
              { label: 'Home', value: FEED_CATEGORIES.DAILY_HIT.id },
              { label: 'Farcaster', value: FEED_CATEGORIES.FARCASTER.id },
              { label: 'Lens', value: FEED_CATEGORIES.LENS.id },
              { label: 'Mirror', value: FEED_CATEGORIES.MIRROR.id },
              { label: 'NFTs', value: FEED_CATEGORIES.NFT.id }
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
          />
        </YupPageHeader>
      )}
      <YupContainer>
        {!isLoggedIn && (
          <Grid container sx={{ mb: 3 }}>
            <Grid
              item
              xs={12}
              md={8}
              lg={7}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: isMobile && 'center'
              }}
            >
              <Grid container direction="column" rowSpacing={2}>
                <Grid item>
                  <Zoom in timeout={500}>
                    <GradientTypography variant="capsized_h2">
                      Web3 Social Network
                    </GradientTypography>
                  </Zoom>
                </Grid>
                <Grid item>
                  <Typography variant="capsized_body2" sx={{ mb: 3 }}>
                    Follow your friends's web3 activity, curate top content from your favorite platforms.
                  </Typography>
                </Grid>
                <Grid item>
                  <FlexBox gap={2} sx={{ width: 240 }}>
                    <Button variant="contained" onClick={openAuthModal}>
                      Connect
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      href={landingPageUrl}
                      target="_blank"
                    >
                      Learn More
                    </Button>
                  </FlexBox>
                </Grid>
              </Grid>
            </Grid>
            {!isMobile && (
              <Grid
                item
                md={4}
                lg={5}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Zoom in timeout={1400}>
                  <lottie-player
                    src="https://assets4.lottiefiles.com/packages/lf20_whnsteqb.json"
                    background="transparent"
                    speed="1.01"
                    style={{
                      height: 400
                    }}
                    loop
                    autoplay
                  />
                </Zoom>
              </Grid>
            )}
          </Grid>
        )}
        <GridLayout
          contentLeft={
            <FeedHOC feedType={isLoggedIn ? selectedTab : 'dailyhits'} />
          }
          contentRight={
            <>
              {isLoggedIn || !windowScrolled ? (
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Explore Yup
                </Typography>
              ) : (
                <Grow in out>
                  <YupCard
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Typography variant="h6">New to Yup?</Typography>
                    <FlexBox
                      gap={2}
                      flexGrow={1}
                      justifyContent="flex-end"
                      sx={(theme) => ({
                        [theme.breakpoints.down('lg')]: {
                          flexDirection: 'column'
                        }
                      })}
                    >
                      <Button variant="contained" onClick={openAuthModal}>
                        Connect
                      </Button>
                      <Button
                        variant="outlined"
                        component={Link}
                        href={landingPageUrl}
                        target="_blank"
                      >
                        Learn More
                      </Button>
                    </FlexBox>
                  </YupCard>
                </Grow>
              )}
              {isLoggedIn && <PeopleToFollow />}
              <FlexBox flexDirection="column" gap={2} sx={{ mt: 2 }}>
                <YupLinkCard
                  to="/feed/farcaster"
                  title="Farcaster Feed"
                  description="Explorer Farcaster content"
                  image="/images/png/feed-farcaster.png"
                />
                <YupLinkCard
                  to="/feed/dailyhits"
                  title="Your Daily Hits"
                  description="See relevant content"
                  image={
                    isLightMode
                      ? '/images/png/feed-dailyhit.png'
                      : '/images/png/feed-dailyhit-dark.png'
                  }
                />
                <YupLinkCard
                  to="/leaderboard?site=all&subject=collections&category=overall"
                  title="Collections"
                  description="See the top collections made by Yup users"
                  image="/images/png/collections.png"
                />
              </FlexBox>
            </>
          }
        />
      </YupContainer>
    </>
  );
}
