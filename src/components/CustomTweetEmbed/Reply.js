import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, Typography, Grid } from '@mui/material';
import TweetVidPlayer from './TweetVidPlayer';
import {
  parseText,
  linkMentions,
  fetchLinkPreviewData
} from '../../utils/post_helpers';
import LinkPreview from './LinkPreview';
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';
import useDevice from '../../hooks/useDevice';
import YupTweetImg from '../YupImage/YupTweetImg';

const DEFAULT_TWITTER_PROF = '/images/default-twitter-prof.png';

function Reply({ tweetData, classes }) {
  const { isMobile } = useDevice();
  const { user } = tweetData.tweetInfo;
  const { url } = tweetData;
  const [previewData, setPreviewData] = useState(null);
  const entities = tweetData.tweetInfo.entities
    ? tweetData.tweetInfo.entities
    : false;
  const entitiesURLS = entities && entities.urls.length > 0;
  const tweetLink = url || '';

  // ORIGINAL
  const extendedEntities = tweetData.tweetInfo.extended_entities
    ? tweetData.tweetInfo.extended_entities
    : false;

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const previewData = await fetchLinkPreviewData(
              entities.urls[0].expanded_url
            );
            setPreviewData(previewData);
          } catch (e) {
            console.log(e);
          }
        })();
      }
    }
  }, []);

  let hasMedia;
  if (extendedEntities) {
    hasMedia = extendedEntities.media
      ? extendedEntities.media.length > 0
      : false;
  }

  let mediaURL;
  let mediaType;
  let hasPhoto;
  let hasVideo;
  if (hasMedia) {
    mediaURL = extendedEntities.media[0].media_url_https
      ? extendedEntities.media[0].media_url_https
      : false;
    mediaType = extendedEntities.media[0].type;
    hasPhoto = Boolean(mediaType === 'photo');
    hasVideo = Boolean(mediaType === 'video' || mediaType === 'animated_gif');

    if (hasVideo)
      mediaURL = extendedEntities.media[0].video_info.variants[0].url;
  }

  let initialText;
  if (tweetData.tweetInfo.text) {
    initialText = tweetData.tweetInfo.text;
  } else if (tweetData.tweetInfo.full_text) {
    initialText = tweetData.tweetInfo.full_text;
  } else {
    initialText = '';
  }

  const tweetText = parseText(initialText);

  // REPLYS
  const replyExtendedEntities =
    tweetData.tweetInfo.reply_status &&
    tweetData.tweetInfo.reply_status.extended_entities
      ? tweetData.tweetInfo.reply_status.extended_entities
      : false;
  let replyHasMedia;
  if (replyExtendedEntities) {
    replyHasMedia = replyExtendedEntities.media
      ? replyExtendedEntities.media.length > 0
      : false;
  }

  let replyMediaURL;
  let replyMediaType;
  let replyHasPhoto;
  let replyHasVideo;
  if (replyHasMedia) {
    replyMediaURL = replyExtendedEntities.media[0].media_url_https
      ? replyExtendedEntities.media[0].media_url_https
      : false;
    replyMediaType = replyExtendedEntities.media[0].type;
    replyHasPhoto = Boolean(replyMediaType === 'photo');
    replyHasVideo = Boolean(
      replyMediaType === 'video' || replyMediaType === 'animated_gif'
    );

    if (replyHasVideo)
      replyMediaURL = replyExtendedEntities.media[0].video_info.variants[0].url;
  }

  let replyStatusText;
  if (
    tweetData.tweetInfo.reply_status &&
    tweetData.tweetInfo.reply_status.text
  ) {
    replyStatusText = tweetData.tweetInfo.reply_status.text;
  } else if (
    tweetData.tweetInfo.reply_status &&
    tweetData.tweetInfo.reply_status.full_text
  ) {
    replyStatusText = tweetData.tweetInfo.reply_status.full_text;
  } else {
    replyStatusText = '';
  }

  const text = parseText(replyStatusText);
  const replyTweetText = text.split('\n').map((line, idx) => (
    <>
      {idx > 0 && <br />}
      {line.split(' ').map((string) => linkMentions(string))}
    </>
  ));

  // REPLY CUSTOM HEADER STYLING CONFIG
  const { userAvatar } = classes;
  const twitterName = classes.replyTwitterName;
  const { twitterBirdIcon } = classes;

  let replyScreenName;
  let replyUserAvatar;
  let replyName;
  if (tweetData.tweetInfo.reply_status) {
    replyScreenName = tweetData.tweetInfo.reply_status.user.screen_name;
    replyUserAvatar =
      tweetData.tweetInfo.reply_status.user.profile_image_url_https;
    replyName = tweetData.tweetInfo.reply_status.user.name;
  }

  const accountLink = `https://twitter.com/${replyScreenName}`;
  const BothHaveMedia = hasMedia && replyHasMedia;
  const smallImage = { maxHeight: 200, maxWidth: 550 };
  const bigImage = { minHeight: 300, maxHeight: 400 };

  const addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_TWITTER_PROF;
  };

  return (
    <Grid container direction="column" className={classes.mainReplyContainer}>
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          spacing={1}
          className={classes.replyContainer}
          style={{ minHeight: '80px' }}
        >
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="stretch"
              justifyContent="space-between"
              style={{ height: '100%' }}
              spacing={1}
            >
              <Grid item>
                {replyUserAvatar ? (
                  <img
                    className={userAvatar}
                    src={replyUserAvatar}
                    alt="user"
                    onError={addDefaultSrc}
                  />
                ) : (
                  <span className={classes.letterAvatar}>
                    {replyName && replyName[0] && replyName[0].toUpperCase()}
                  </span>
                )}
              </Grid>
              <Grid item xs>
                <Grid container direction="row" style={{ height: '100%' }}>
                  <Grid item xs />
                  <Grid
                    item
                    style={{ height: '100%' }}
                    xs="1.5px"
                    className={classes.barDiv}
                  />
                  <Grid item xs />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container direction="row" spacing={1}>
              <Grid item className={classes.header} xs={12}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item>
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      className={classes.userTags}
                    >
                      <Grid item>
                        <Link
                          href={accountLink}
                          target="_blank"
                          underline="none"
                        >
                          <h4 className={twitterName}>{replyName}</h4>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link
                          href={accountLink}
                          target="_blank"
                          underline="none"
                        >
                          <Grid>
                            <Typography
                              variant="body2"
                              className={classes.twitterHandle}
                            >
                              @{replyScreenName}
                            </Typography>
                          </Grid>
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item className={twitterBirdIcon}>
                    <Link href={tweetLink} target="_blank" underline="none">
                      <img
                        src="/images/icons/twitter.svg"
                        height={isMobile ? '12' : '16'}
                        alt="twitter"
                      />
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                className={classes.replyContent}
                style={{ paddingBottom: '8px' }}
                xs={12}
              >
                <Link href={tweetLink} target="_blank" underline="none">
                  <Typography variant="body2">{replyTweetText}</Typography>
                </Link>
              </Grid>
              {replyHasPhoto && replyMediaURL ? (
                <Grid item className={classes.replyImageContainer} xs={12}>
                  <YupTweetImg
                    className={classes.tweetImg}
                    style={BothHaveMedia ? smallImage : bigImage}
                    src={
                      tweetData.excludeTweet
                        ? 'https://api.faviconkit.com/twitter.com/128'
                        : replyMediaURL
                    }
                    alt="tweet-image"
                  />
                </Grid>
              ) : (
                replyHasVideo &&
                replyMediaURL && (
                  <Grid
                    item
                    className={classes.replyImageContainer}
                    xs={12}
                    sx={{ mb: 2 }}
                  >
                    <TweetVidPlayer url={replyMediaURL} />
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* REPLY TWEET */}
      <Grid item>
        <Grid container className={classes.replyOriginalContainer}>
          <Grid item="item" xs={12}>
            <Grid container="container" direction="row" spacing={1}>
              <Grid item="item">
                <Avatar classes={classes} user={user} tweetLink={tweetLink} />
              </Grid>
              <Grid item="item" xs>
                <Grid container="container" direction="column" spacing={1}>
                  <Grid item="item">
                    <HeaderSection classes={classes} user={user} hideBird />
                  </Grid>
                  <Grid item>
                    <Link href={tweetLink} target="_blank" underline="none">
                      <Typography variant="body2" className={classes.tweetText}>
                        {tweetText.replace(/@\S+\s?/gm, '')}
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    {entitiesURLS && !replyHasMedia && !mediaURL && (
                      <Grid>
                        {previewData ? (
                          <LinkPreview
                            size="large"
                            classes={classes}
                            description={previewData && previewData.description}
                            image={previewData && previewData.img}
                            title={previewData && previewData.title}
                            url={entities.urls[0].expanded_url}
                          />
                        ) : (
                          <Link
                            target="_blank"
                            href={entities.urls[0].expanded_url}
                            rel="noreferrer"
                          >
                            {entities.urls[0].expanded_url}
                          </Link>
                        )}
                      </Grid>
                    )}
                    {hasPhoto && mediaURL ? (
                      <Typography className={classes.tweetText}>
                        <YupTweetImg
                          className={classes.tweetImg}
                          src={
                            tweetData.excludeTweet
                              ? 'https://api.faviconkit.com/twitter.com/128'
                              : mediaURL
                          }
                          alt="tweet-image"
                        />
                      </Typography>
                    ) : (
                      hasVideo && mediaURL && <TweetVidPlayer url={mediaURL} />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

Reply.propTypes = {
  classes: PropTypes.object.isRequired,
  tweetData: PropTypes.object.isRequired
};
export default Reply;
