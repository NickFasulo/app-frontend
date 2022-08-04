import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, Typography, Grid } from '@mui/material';

// util
import { parseWeb3Post, fetchLinkPreviewData } from './Util/Util';

// components
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';

const Original = ({ postid, web3Preview, classes }) => {
  const extendedEntities = false;
  const [linkPreviewData, setPreviewData] = useState(null);
  const entities = false;
  const entitiesURLS = entities && entities.urls.length > 0;

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const web3Preview = await fetchLinkPreviewData(
              entities.urls[0].expanded_url
            );
            setPreviewData(web3Preview);
          } catch (err) {
            console.error(err);
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
  let tweetLink = web3Preview.id ? web3Preview.id : '';
  if (hasMedia) {
    mediaURL = extendedEntities.media[0].media_url_https
      ? extendedEntities.media[0].media_url_https
      : false;
    mediaType = extendedEntities.media[0].type;
    hasPhoto = Boolean(mediaType === 'photo');
    hasVideo = Boolean(mediaType === 'video' || mediaType === 'animated_gif');

    if (hasVideo) {
      mediaURL = extendedEntities.media[0].video_info.variants[0].url;
    }
  }

  return (
    <Grid container="container" className={classes.container}>
      <Grid item="item" xs={12}>
        <Grid container="container" direction="row" spacing={1}>
          <Grid item="item">
            <Avatar
              classes={classes}
              url={web3Preview.creator.avatarUrl}
              tweetLink={tweetLink}
            />
          </Grid>
          <Grid item="item" xs>
            <Grid container="container" direction="row" spacing={0}>
              <Grid item="item" xs={12}>
                <HeaderSection
                  classes={classes}
                  name={web3Preview.creator.fullname}
                  handle={web3Preview.creator.handle}
                  address={web3Preview.creator.address}
                  protocol={web3Preview.protocol}
                  replyParentUsername={
                    web3Preview.meta.replyParentUsername?.username
                  }
                  tweetLink={tweetLink}
                />
              </Grid>
              <Grid item="item" xs={12}>
                <Grid container="container" spacing={1}>
                  {/* {postid} */}
                  <Grid item="item" xs={12}>
                    {/* <Link href={tweetLink} target="_blank" underline="none"> */}
                    <Typography variant="body2">
                      {parseWeb3Post(web3Preview, postid)}
                    </Typography>
                    {/* </Link> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Original.propTypes = {
  web3Preview: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default Original;
