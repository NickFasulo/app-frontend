import { Button, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
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
import HomePageUserHeader from '../components/HomePageUserHeader';
import PeopleToFollow from '../components/PeopleToFollow/PeopleToFollow';
import { useThemeMode } from '../contexts/ThemeModeContext';
import useDevice from '../hooks/useDevice';
import { useAppUtils } from '../contexts/AppUtilsContext';
import Link from '../components/Link';
import { landingPageUrl } from '../config';
import { useAuthModal } from '../contexts/AuthModalContext';
import YupHead from '../components/YupHead';

export default function HomePage() {
  const { isMobile } = useDevice();
  const { isLightMode } = useThemeMode();
  const { setHeaderHeight } = useAppLayout();
  const { isLoggedIn } = useAuth();
  const { windowScrolled } = useAppUtils();
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    import('@lottiefiles/lottie-player');
    setHeaderHeight(0);
  }, []);

  return (
    <>
      <YupHead
        title="Yup"
        description="Social Network for Curators"
        metaOg={{
          site_name: 'Yup'
        }}
      />
      <YupContainer>
        {isLoggedIn ? (
          <HomePageUserHeader />
        ) : (
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
                  <GradientTypography variant="capsized_h2">
                    Web3 Social Network
                  </GradientTypography>
                </Grid>
                <Grid item>
                  <Typography variant="capsized_body2" sx={{ mb: 3 }}>
                    Aggregated content from your friends and favorite creators
                    on top platforms. Curate and share across the web. Earn
                    money and clout for your taste
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
              </Grid>
            )}
          </Grid>
        )}
        <GridLayout
          contentLeft={
            <>
              {!isMobile && (
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Feed
                </Typography>
              )}
              <FeedHOC feedType="dailyhits" />
            </>
          }
          contentRight={
            <>
              {isLoggedIn || !windowScrolled ? (
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Explore Yup
                </Typography>
              ) : (
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
