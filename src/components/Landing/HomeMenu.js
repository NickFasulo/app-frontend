import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import withTheme from '@mui/styles/withTheme';
import {
  Grid,
  Typography,
  Zoom,
  Grow,
  Card,
  CardContent,
  CardActions,
  Fade
} from '@mui/material';
import '../Twitter/twitter.module.css';
import Tilt from 'react-tilt';
import { Mono } from '../../utils/colors.js';
import { YupButton } from '../Miscellaneous';
import { PageBody } from '../../_pages/pageLayouts';
import useStyles from './styles';
import useDevice from '../../hooks/useDevice';
import { landingPageUrl } from '../../config';
import Link from '../Link';
import YupImage from '../YupImage';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { generateCollectionUrl } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import FeedHOC from '../Feed/FeedHOC';
import FeedCategoryList from '../FeedContainer/FeedCategoryList';
import { FunctionalErrorBoundary } from '../ErrorBoundary/FunctionalErrorBoundary';
import { useRecommendation } from '../../hooks/queries';
import YupHead from '../YupHead';

const DEFAULT_COLLECTION_IMGS = [...Array(5)].map(
  (_, i) => `/images/gradients/gradient${i + 1}.webp`
);
const getRandomGradientImg = () =>
  `${
    DEFAULT_COLLECTION_IMGS[
      Math.floor(Math.random() * DEFAULT_COLLECTION_IMGS.length)
    ]
  }`;

function Home({ theme }) {
  const classes = useStyles();
  const { isMobile } = useDevice();
  const { open: openAuthModal } = useAuthModal();
  // const { isLoggedIn, username } = useAuth();
  const { isLoggedIn } = useAuth();
  const recommendedCollections = useRecommendation({ limit: 7 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [recommendedFloating, setRecommendeFloating] = useState(false);
  const feedRef = useRef();
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  useEffect(() => {
    if (feedRef?.current) {
      if (feedRef.current.offsetTop <= scrollPosition) {
        !recommendedFloating && setRecommendeFloating(true);
      } else if (feedRef.current.offsetTop > scrollPosition) {
        recommendedFloating && setRecommendeFloating(false);
      }
    }
  }, [scrollPosition]);
  return (
    <FunctionalErrorBoundary>
      <YupHead
        title="Yup"
        description="Social Network for Curators"
        metaOg={{
          site_name: 'Yup'
        }}
      />
      <div className={classes.container}>
        <PageBody pageClass={classes.page}>
          <Grid
            className={classes.gridContainer}
            container
            direction="row"
            justifyContent="flex-start"
            rowSpacing={2}
            alignItems="stretch"
          >
            <Grid item xs={12}>
              <Grid container direction="row" spacing={2} alignItems="stretch">
                <Grid item md={12} xs={12}>
                  <Fade in style={{ transitionDelay: '50ms' }} timeout={300}>
                    <Card
                      elevation={0}
                      className={classes.bannerCard}
                      style={{
                        backgroundImage: isLoggedIn
                          ? `linear-gradient(to top, #825EC6, ${theme.palette.M700})`
                          : "url('images/feeds/rainbowbanner.svg')"
                      }}
                    >
                      <CardContent>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item xs={isMobile ? 12 : 7}>
                            <Zoom
                              in
                              style={{ transitionDelay: '50ms' }}
                              timeout={100}
                            >
                              <Typography
                                variant="h1"
                                className={classes.titlePlain}
                              >
                                {isLoggedIn
                                  ? `Farcaster Feed`
                                  : `Social Network for Curators`}
                              </Typography>
                            </Zoom>
                            <Zoom
                              in
                              style={{ transitionDelay: '50ms' }}
                              timeout={300}
                            >
                              <Typography
                                variant="subtitle1"
                                className={classes.subtitle}
                              >
                                {isLoggedIn
                                  ? `Explore Farcaster content`
                                  : `Curate and share content across the web. Earn money and clout for your taste`}
                              </Typography>
                            </Zoom>
                          </Grid>
                          <Grid
                            item
                            container
                            justifyContent="center"
                            xs={5}
                            style={{ display: isMobile ? 'none' : 'inherit' }}
                          >
                            <YupImage
                              className={
                                isLoggedIn
                                  ? classes.bannerMediaUser
                                  : classes.bannerMediaNews
                              }
                              src={
                                isLoggedIn
                                  ? 'images/graphics/farcaster_logo.svg'
                                  : 'images/graphics/coingraphic.png'
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        {isLoggedIn ? (
                          <Link className={classes.link} href="/feed/farcaster">
                            <YupButton
                              size="large"
                              variant="contained"
                              color="secondary"
                            >
                              Enter
                            </YupButton>
                          </Link>
                        ) : (
                          <>
                            <Fade
                              in
                              style={{ transitionDelay: '100ms' }}
                              timeout={100}
                            >
                              <a>
                                <YupButton
                                  size="large"
                                  variant="contained"
                                  color="primary"
                                  onClick={openAuthModal}
                                >
                                  Start Now
                                </YupButton>
                              </a>
                            </Fade>
                            <Fade
                              in
                              style={{ transitionDelay: '200ms' }}
                              timeout={100}
                            >
                              <a
                                className={classes.link}
                                href={landingPageUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <YupButton
                                  size="large"
                                  variant="outlined"
                                  color="secondary"
                                >
                                  Learn More
                                </YupButton>
                              </a>
                            </Fade>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              </Grid>
            </Grid>
            {/* HIDDEN TO FOCUS ON FEED
            {userCollections?.length > 0 && (
            <Grid item xs={12} style={{ display: isLoggedIn ? 'inherit' : 'none' }}>
                <Grid container direction="row">
                  <Grid item xs={12}>
                    <Fade in style={{ transitionDelay: '50ms' }} timeout={300}>
                      <Typography variant="h5">Your Collections</Typography>
                    </Fade>
                  </Grid>
                  <Grid item xs={12}>
                    <Fade in style={{ transitionDelay: '80ms' }} timeout={150}>
                      <Grid container spacing={2}>
                        {userCollections.slice(0, 4).map((coll, idx) => (
                          <Grid
                            key={idx}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            className={classes.linkItemContainer}
                          >
                            <Link
                              href={generateCollectionUrl(coll.name, coll._id)}
                              className={classes.link}
                            >
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className={classes.recommendedContainer}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  lg={4}
                                  xl={4}
                                  p={1}
                                  className={classes.recommendedImgContainer}
                                >
                                  <YupImage
                                    src={[
                                      coll.imgSrcUrl,
                                      getRandomGradientImg()
                                    ]}
                                    alt="thumbnail"
                                    className={classes.recommendedImg}
                                  />
                                </Grid>
                                <Grid item xs={8} lg={8} xl={8} p={1}>
                                  <TruncateText variant="h6" lines={1}>
                                    {coll.name}
                                  </TruncateText>
                                  <Typography variant="body2">
                                    {coll.postIds.length === 1
                                      ? `1 post`
                                      : `${coll.postIds.length} posts`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Link>
                          </Grid>
                        ))}
                      </Grid>
                    </Fade>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container direction="column">
                <Grid item xs={12}><Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Fade in style={{ transitionDelay: '500ms' }} timeout={400}>
                        <Typography variant="h5">Browse</Typography>
                      </Fade>
                    </Grid>
                    {recommendedCollections &&
                      recommendedCollections.map((coll) => {
                        if (!coll) return null;
                        return (
                        <Fade in style={{ transitionDelay: `${200}ms` }} timeout={200}>
                          <Grid
                            key={coll._id}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            className={classes.linkItemContainer}
                          >
                            <Link
                              href={generateCollectionUrl(coll.name, coll._id)}
                              className={classes.link}
                            >
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className={classes.recommendedContainer}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  lg={4}
                                  xl={4}
                                  p={1}
                                  className={classes.recommendedImgContainer}
                                >
                                  <YupImage
                                    src={[
                                      coll.imgSrcUrl,
                                      getRandomGradientImg()
                                    ]}
                                    alt="thumbnail"
                                    className={classes.recommendedImg}
                                  />
                                </Grid>
                                <Grid item xs={8} lg={8} xl={8} p={1}>
                                  <TruncateText variant="h6" lines={1}>
                                    {coll.name}
                                  </TruncateText>
                                  <Typography variant="body2">
                                    {coll.owner}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Link>
                          </Grid>
                        </Fade>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                  <Fade in style={{ transitionDelay: '700ms' }} timeout={200}>
                    <Typography variant="h5">Feed</Typography>
                  </Fade>
                </Grid>
                <Fade
                  in
                  style={{ transitionDelay: '800ms' }}
                  timeout={200}
                  ref={feedRef}
                >
                  <Grid item xs={12} md={8} lg={7}>
                    <FeedHOC feedType="dailyhits" />
                  </Grid>
                </Fade>
                <Fade
                  in
                  style={{ transitionDelay: '850ms' }}
                  timeout={200}
                  sx={
                    recommendedFloating && {
                      position: 'fixed',
                      top: 0,
                      left: `${
                        feedRef.current.clientWidth + feedRef.current.offsetLeft
                      }px`
                    }
                  }
                >
                  <Grid item xs={12} md={4} lg={5}>
                    <Typography variant="h6" sx={{ pb: 1 }}>
                      Recommended
                    </Typography>
                    <FeedCategoryList currentCategoryId="dailyhits" />
                  </Grid>
                </Fade>
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </div>
    </FunctionalErrorBoundary>
  );
}

Home.propTypes = {
  theme: PropTypes.object.isRequired
};

export default memo(withTheme(Home));
