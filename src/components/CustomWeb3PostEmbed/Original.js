import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, Typography, Grid } from '@mui/material';

// util
import { parseWeb3Post, fetchLinkPreviewData } from './Util/Util';

// components
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';
import FarCasterPost from './FarCasterPost';
import LensPost from './LensPost';

const Original = ({ postid, web3Preview, classes }) => {
  const extendedEntities = false;
  const [linkPreviewData, setPreviewData] = useState(null);
  const entities = false;
  const entitiesURLS = entities && entities.urls.length > 0;
  const { content, urls, attachments, linkPreview, protocol } = web3Preview;

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
      {postid}
      {protocol==='farcaster' ?
      (<FarCasterPost text={content} attachments={attachments} postid={postid} post={web3Preview} classes={classes}/>
      ):(<LensPost 
        text={content}
        url={urls[0]}
        attachments={attachments}
        postid={postid}
        linkPreview={linkPreview}
        post={web3Preview}
        classes={classes}/>)}
     
    </Grid>
  );
};

Original.propTypes = {
  web3Preview: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default Original;
