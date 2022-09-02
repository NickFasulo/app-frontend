/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import {
  convertIPFSSrcToHttps,
  parsePhaverText
} from '../../utils/post_helpers';
import YupReactMarkdown from '../YupReactMarkdown';
import Avatar from './Avatar';
import HeaderSection from './HeaderSection';
import YupImage from '../YupImage';
import useDevice from '../../hooks/useDevice';
import { isYoutubeUrl } from '../../utils/helpers';
import VideoComponent from '../VideoComponent';

const WrapLink = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

function LensPost({
  postid,
  text,
  url,
  attachments,
  linkPreview,
  classes,
  post,
  showFullPost
}) {
  const { isTiny } = useDevice();
  const { pathname } = useRouter();

  const multipleAttachments = () =>
    attachments.length > 1 && attachments[0].images.length > 0;
  const getLinkPreview = (url) => linkPreview.find((x) => x.url === url);

  if (post.meta.metadata?.appId === 'phaver' && linkPreview?.[0]) {
    text = parsePhaverText(text, linkPreview?.[0]);
  }

  return (
    <Grid item="item" xs={12}>
      <Grid container="container" direction="row" spacing={1}>
        <Grid item="item">
          <Avatar
            classes={classes}
            url={post.creator.avatarUrl}
            tweetLink={post.id}
          />
        </Grid>
        <Grid item="item" xs>
          <Grid container="container" direction="row" spacing={0}>
            <Grid item="item" xs={12}>
              <HeaderSection
                classes={classes}
                name={post.creator.fullname}
                handle={post.creator.handle}
                address={post.creator.address}
                protocol={post.protocol}
                replyParentUsername={post.meta.replyParentUsername?.username}
                tweetLink={post.id}
                createdAt={post.createdAt}
              />
            </Grid>
            <Grid item="item" xs={12}>
              <Grid container="container" spacing={1}>
                <Grid item="item" xs={12} sx={{ cursor: 'pointer' }}>
                  {/* <Link href={tweetLink} target="_blank" underline="none"> */}
                  <WrapLink
                    condition={!showFullPost}
                    wrapper={(children) => (
                      <Link
                        href={`/post/${postid}`}
                        target="_blank"
                        underline="none"
                      >
                        {children}
                      </Link>
                    )}
                  >
                    <Typography variant="body2">
                      <Grid
                        item
                        // Enable to style links
                        //     sx={{ "& *> a": {
                        //         backgroundImage: "linear-gradient(270deg, #00E08E 0%, #A2CF7E 24.57%, #F0C909 50.35%, #FCA016 75.4%, #EB3650 100%)",
                        //         fontWeight: 700,
                        //         position: "relative",
                        //         color: "transparent",
                        //         WebkitBackgroundClip: "text",
                        //         backgroundClip: "text",
                        //         backgroundSize: "300% 100%",
                        // }  }}
                      >
                        {/* If text hasnt been changed for Linkpreviews */}
                        {/* disabled! */}
                        <YupReactMarkdown
                          linkPreview={linkPreview}
                          lines={!showFullPost && 7}
                          classes={classes}
                        >
                          {text}
                        </YupReactMarkdown>

                        {/* If post has Attachments */}
                        {attachments?.length > 0 &&
                          (!linkPreview ||
                            post.meta.metadata?.appId !== 'phaver') && (
                            <ImageList
                              sx={{
                                borderRadius: '12px',
                                height: 350,
                                overflow: 'hidden'
                              }}
                              cols={isTiny ? 1 : multipleAttachments() ? 2 : 1}
                            >
                              {attachments.map((attachment, index) => (
                                <ImageListItem
                                  sx={{ overflow: 'hidden' }}
                                  key={attachment.images[0]}
                                >
                                  {isYoutubeUrl(attachment.url) ? (
                                    <VideoComponent url={attachment.url} />
                                  ) : attachment.images[0] ? (
                                    <YupImage
                                      height={multipleAttachments() && 350}
                                      src={convertIPFSSrcToHttps(
                                        attachment.images[0]
                                      )}
                                      alt={attachment.images[0]}
                                    />
                                  ) : (
                                    <div>
                                      {index === 0 && (
                                        <ReactPlayer
                                          controls
                                          url={attachment.videos[0]}
                                          width="100%"
                                          style={{
                                            borderRadius: 12,
                                            overflow: 'hidden'
                                          }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </ImageListItem>
                              ))}
                            </ImageList>
                          )}
                      </Grid>
                    </Typography>
                    {/* </Link> */}
                  </WrapLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LensPost;
