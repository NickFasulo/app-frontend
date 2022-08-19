import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinkPreview from '../LinkPreview/LinkPreview';
import { Link, Typography, Grid } from '@mui/material';
import TweetVidPlayer from './TweetVidPlayer';
import { parseText,  urlIsImg } from '../../utils/post_helpers';
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';
import { CldImg } from '../Miscellaneous';

const DEFAULT_TWITTER_PROF = '/images/default-twitter-prof.png';

const Reply = ({ post, classes, postid }) => {
  const parents = post.meta.parents;
  const userName = post.creator.fullname;
  const userHandle = post.creator.handle;
  const userAvatar = post.meta.avatar;
  const userPostText = parseText(post.content);
  const userPostLink = `farcaster://profiles/${post.creator.address}/posts`;
  const userAttachments = post.attachments;

  const directParent = parents[0];
  const directParentAttachments = directParent.attachments?.openGraph;
  const directParentName = directParent.meta.displayName;
  const directParentHandle = directParent.body.username;
  const directParentAvatar = directParent.meta.avatar;
  const directParentPostText = parseText(directParent.body.data.text);
  const directParentPostLink = `farcaster://profiles/${directParent.body.address}/posts`;

  const imgRef = useRef(null);
  console.log({ directParentPostLink, userPostLink });

  const addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_TWITTER_PROF;
  };

  const handleLoad = () => {
    const imgElement = imgRef.current;

    if (!imgElement) return;

    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;

    if (width >= height) {
      // Ratio >= 1
      imgElement.style.width = '100%';
      imgElement.style.objectFit = 'cover';
      imgElement.style.minHeight = '200px';
      imgElement.style.maxHeight = '500px';
    } else {
      // Ratio < 1
      imgElement.style.maxHeight = '400px';
      imgElement.style.objectFit = 'fit-content';
    }
  };

  return (
    <Grid
      container
      direction="row"
      className={classes.mainReplyContainer}
      rowSpacing={2}
    >
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
                <Avatar classes={classes} url={directParentAvatar} />
              </Grid>
              <Grid item xs>
                <Grid container direction="row" style={{ height: '100%' }}>
                  <Grid item xs />
                  <Grid item xs="1.5px" className={classes.barDiv} />
                  <Grid item xs />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container direction="row" rowSpacing={0.5}>
              <Grid item xs={12}>
                <HeaderSection
                  classes={classes}
                  name={directParentName}
                  handle={directParentHandle}
                  address={directParent.body.address}
                  protocol={post.protocol}
                  //WRONG, NEEDS TO BE PARENTS POST ID; NOT REPLY ID
                  tweetLink={post.id}
                  createdAt={directParent.body.publishedAt}
                  noBird
                  meta={post.meta}
                />
              </Grid>
              <Grid item xs={12}>
               <Link href={`/post/${postid}`}>
                <Typography variant="body2">{directParentPostText}</Typography>
               </Link>
              </Grid>

              <Grid item="item" xs={12}>
                {directParentAttachments
                  ? directParentAttachments.map((attachment) => {
                      if (attachment.image || urlIsImg(attachment.url)) {
                        return (
                            <CldImg
                            style={{ borderRadius: '12px' }}
                            src={urlIsImg(attachment.url)?attachment.url:attachment.image}
                            alt={attachment.title}
                            isWeb3Post
                          />
                        );
                      } else if (attachment.url) {
                        return (
                          
                          <LinkPreview
                            description={attachment.description || ''}
                            image={attachment.image}
                            title={attachment.title}
                            url={attachment.url}
                            // classes={classes}
                          />
                        );
                      }
                    })
                  : null}
              </Grid>
              {/* {replyHasPhoto && replyMediaURL ? (
                <Grid item className={classes.replyImageContainer}>
                  <img
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
                  <Grid item className={classes.replyImageContainer}>
                    <TweetVidPlayer url={replyMediaURL} />
                  </Grid>
                )
              )} */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* REPLY POST */}
      <Grid item xs={12}>
        <Grid
          container="container"
          direction="row"
          spacing={1}
          className={classes.replyOriginalContainer}
        >
          <Grid item="item">
            <Avatar classes={classes} url={userAvatar} />
          </Grid>
          <Grid item="item" xs>
            <Grid container="container" direction="row" spacing={1}>
              <Grid item="item" xs={12}>
                <HeaderSection
                  classes={classes}
                  name={userName}
                  handle={userHandle}
                  address={post.creator.address}
                  tweetLink={post.id}
                  createdAt={post.createdAt}
                  hideBird
                />
              </Grid>
              <Grid item xs={12}>
                <Link href={`/post/${postid}`}>
                  <Grid container spacing={1}>
                    <Grid item="item" xs={12}>
                      {/* <Link  target="_blank" underline="none"> */}
                      <Typography className={classes.tweetText} variant="body2">
                        {userPostText}
                      </Typography>
                      {/* </Link> */}
                    </Grid>
                    <Grid item="item" xs={12}>
                      {userAttachments
                        ? userAttachments.map((attachment) => {
                          if (attachment.images?.[0]) {
                            return (
                              <LinkPreview
                                description={attachment.description || ''}
                                image={
                                  attachment.images?.[0]
                                    ? attachment.images[0]
                                    : attachment.url
                                }
                                title={attachment.title}
                                url={attachment.url}
                                // classes={classes}
                              />
                            );
                          } else if (urlIsImg(attachment.url)) {
                            return (
                              <CldImg
                                style={{ borderRadius: '12px' }}
                                src={attachment.url}
                                alt={attachment.title}
                                isWeb3Post
                              />
                            );
                          }
                        })
                        : null}
                    </Grid>
                  </Grid>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Reply.propTypes = {
  classes: PropTypes.object.isRequired,
  tweetData: PropTypes.object.isRequired
};
export default Reply;
