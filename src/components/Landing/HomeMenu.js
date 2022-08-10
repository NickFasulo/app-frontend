import React, { memo, useEffect, useState } from 'react';
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
import '../../components/Twitter/twitter.module.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tilt from 'react-tilt';
import axios from 'axios';
import { Mono } from '../../utils/colors.js';
import { accountInfoSelector } from '../../redux/selectors';
import HomeMenuLinkItem from './HomeMenuLinkItem';
import { connect, useDispatch } from 'react-redux';
import { YupButton } from '../Miscellaneous';
import { PageBody } from '../../_pages/pageLayouts';
import useStyles from './styles';
import useDevice from '../../hooks/useDevice';
import { apiBaseUrl, landingPageUrl } from '../../config';
import Link from '../Link';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { generateCollectionUrl } from '../../utils/helpers';
import { fetchUserCollections } from '../../redux/actions';
import { useAuth } from '../../contexts/AuthContext';
import FeedHOC from '../Feed/FeedHOC';
import UserNewConnections from '../../components/UserNewConnections';
import FeedCategoryList from '../../components/FeedContainer/FeedCategoryList';

const DEFAULT_COLLECTION_IMGS = [...Array(5)].map(
  (_, i) => `/images/gradients/gradient${i + 1}.webp`
);
const getRandomGradientImg = () =>
  `${
    DEFAULT_COLLECTION_IMGS[
      Math.floor(Math.random() * DEFAULT_COLLECTION_IMGS.length)
    ]
  }`;

const Home = ({ isUser, userCollections, theme }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { isMobile } = useDevice();
  const { open: openAuthModal } = useAuthModal();
  const { isLoggedIn, username } = useAuth();

  const [linkItems, setLinkItems] = useState([]);
  const [cardItems, setCardItems] = useState([]);
  const [recommendedCollections, setRecommendedCollections] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/home-config/v2`)
      .then(({ data: { cardItems, linkItems } }) => {
        setCardItems(cardItems);
        setLinkItems(linkItems);
      });
    axios
      .get(`${apiBaseUrl}/collections/recommended?limit=7`)
      .then(({ data: recommendedCollections }) => {
        setRecommendedCollections(recommendedCollections);
      });

    if (isLoggedIn) {
      dispatch(fetchUserCollections(username));
    }
  }, []);

  return (
    <ErrorBoundary>
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
                  <Zoom in timeout={600}>
                    <Card
                      elevation={0}
                      className={classes.bannerCard}
                      style={{
                        backgroundImage: isUser
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
                            <Grow in timeout={1600}>
                              <Typography
                                variant="h1"
                                className={classes.titlePlain}
                              >
                                {isUser
                                  ? `Farcaster Feed`
                                  : `Social Network for Curators`}
                              </Typography>
                            </Grow>
                            <Grow in timeout={1800}>
                            <Typography
                              variant="subtitle1"
                              className={classes.subtitle}
                            >
                              {isUser
                                ? `Explore Farcaster content`
                                : `Curate and share content across the web. Earn money and clout for your taste`}
                              </Typography>
                            </Grow>
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
                                isUser
                                  ? classes.bannerMediaUser
                                  : classes.bannerMediaNews
                              }
                              src={
                                isUser
                                  ? 'images/graphics/farcaster_logo.svg'
                                  : 'images/graphics/coingraphic.png'
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        {isUser ? (
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
                          <Zoom in timeout={1500}>
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
                          </Zoom>
                          <Zoom in timeout={1800}>
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
                            </Zoom>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start"
              >
                {cardItems &&
                  cardItems.map((item, index) => {
                    return (
                      <Grid
                        item
                        key={index}
                        xs={6}
                        sm={3}
                        className={classes.imageCardGrid}
                      >
                        <Link href={item.route} className={classes.link}>
                            <Grid
                              container
                              direction="column"
                              alignItems="stretch"
                              spacing={1}
                            >
                              <Zoom direction="up"  in timeout={500 + 400 * index}>
                                <Grid item>
                                  <Tilt
                                    options={{
                                      max: 10,
                                      scale: 1.1,
                                      perspective: 2000
                                    }}
                                  >
                                    <Card
                                      elevation={0}
                                      style={{
                                        backgroundImage: `url(${item.imgSrc})`
                                      }}
                                      alt={item.title}
                                      className={classes.imageCard}
                                    >
                                      <Typography
                                        variant="h6"
                                        style={{ color: Mono.M50 }}
                                      >
                                        {item.title}
                                      </Typography>
                                    </Card>
                                  </Tilt>
                                  </Grid>
                                </Zoom>
                            </Grid>
                        </Link>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
            {userCollections?.length > 0 && (
              <Grid item xs={12} style={{ display: isUser ? 'inherit' : 'none' }}>
                <Grid container direction="row">
                  <Grid item xs={12}>
                    <Zoom in timeout={1400}>
                      <Typography variant="h5">Your Collections</Typography>
                    </Zoom>
                  </Grid>
                  <Grid item xs={12}>
                    <Zoom direction="up"  in timeout='auto'>
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
                    </Zoom>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container direction="column">
                <Grid item xs={12}><Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Fade in timeout={2400}>
                        <Typography variant="h5">Browse</Typography>
                      </Fade>
                    </Grid>
                    {recommendedCollections &&
                      recommendedCollections.map((coll) => {
                        if (!coll) return null;
                        return (
                        <Zoom in timeout={2800}>
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
                        </Zoom>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction='row' spacing={2}>
                <Grid item xs={12}>
                  <Zoom  in timeout={3200}>
                    <Typography variant="h5">Feed</Typography>
                  </Zoom>
                </Grid>
                  <Zoom  in timeout={3500}>
                    <Grid item xs={12} sm={7} md={8}>
                      <FeedHOC feedType='dailyhits' />
                    </Grid>
                  </Zoom>
                  <Zoom direction="up"  in timeout={4000}>
                    <Grid item xs={12} sm={5} md={4}>
                        <Typography variant="h6" sx={{ pb: 1 }}>
                          Recommended
                        </Typography>
                        <FeedCategoryList currentCategoryId='dailyhits' />
                    </Grid>
                  </Zoom>
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state) => {
  const account = accountInfoSelector(state);
  const isUser = account && account.name;
  const { collections: userCollections } =
    state.userCollections[account && account.name] || {};
  return {
    isUser,
    userCollections
  };
};

Home.propTypes = {
  userCollections: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isUser: PropTypes.bool.isRequired
};

export default memo(connect(mapStateToProps)(withTheme(Home)));
