import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import {
  fetchLinkPreviewData,
  getAllLinks,
  getNameInBrackets,
  linkMentions,
  markdownReplaceHashtags
} from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { CldImg, SeeMore } from '../Miscellaneous';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import YupReactMarkdown from '../ReactMarkdown';
import Avatar from './Avatar';
import HeaderSection from './HeaderSection';

const TeaPartyLink = styled('a')(
  ({ theme }) => `
    background-image: linear-gradient(90deg,#12c2e9,#c471ed,#12c2e9,#f64f59,#c471ed,#ebed71);
    font-weight: 700;
    position: relative;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 300% 100%;
    `
);

const LensPost = ({ postid, text, url, attachments, linkPreview, classes, post}) => {
  const { pathname } = useRouter();
  const parsedText = text //markdownReplaceHashtags(text);

  const multipleAttachments = () => {
    return attachments.length > 1 && attachments[0].images.length > 0;
  };
  const getLinkPreview = (url) => {
    return linkPreview.find(x => x.url === url);
  }
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };

  console.log({ pathname }, isFullPost());
  //Uncomment to get LinkPreviews

  const regexLinks = /http[s]?:\/\/.*?( |\n|\t|$){1}/g;
    const matches = parsedText.match(regexLinks)
    if(linkPreview){
        if(matches){
            matches?.forEach((element,i) => {
              parsedText = reactStringReplace(parsedText, element, (match) => {
                const linkPreviewData = getLinkPreview(decodeURIComponent(match))
                // const url = getAllLinks(match)?.[0]
                // const name = getNameInBrackets(match)?.[0]

              //  console.log({match, text, matches},getNameInBrackets(match))
                // const data = await fetchLinkPreviewData(url)
                // console.log(url, data, "MATCHHH")
                if(linkPreviewData){
                return <LinkPreview
                size={'large'}
                image={linkPreviewData.img}
                title={linkPreviewData.title}
                url={linkPreviewData.url}
                description={linkPreviewData.description}
                />
                }
            });
            });
        }

    }

    console.log({parsedText,matches}, "WURST")
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
                  replyParentUsername={
                    post.meta.replyParentUsername?.username
                  }
                  tweetLink={post.id}
                  createdAt={post.createdAt}
                />
              </Grid>
              <Grid item="item" xs={12}>
                <Grid container="container" spacing={1}>
                  <Grid item="item" xs={12}>
                    {/* <Link href={tweetLink} target="_blank" underline="none"> */}
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
      {/*If text has been changed for Linkpreviews */}
      {Array.isArray(parsedText) ? (
        <>
          {parsedText.map((element, i) => {
            return typeof element === 'string' ? (
              <YupReactMarkdown key={i}>{element}</YupReactMarkdown>
            ) : (
              element
            );
          })}
        </>
      ) : (
        <>
          {/*If text hasnt been changed for Linkpreviews */}
          {/* disabled! */}
          {isFullPost()||true? (
            <YupReactMarkdown>{parsedText}</YupReactMarkdown>
          ) : (
            <SeeMore maxChars={attachments ? 150 : 400} postid={postid}>
              {parsedText}
            </SeeMore>
          )}

          {/*If post has Attachments */}
          {attachments?.length > 0 && (
            <ImageList
              sx={{
                borderRadius: '12px',
                height: isFullPost() ? 450 : 300,
                overflow: 'hidden'
              }}
              cols={multipleAttachments() ? 2 : 1}
            >
              {attachments.map((attachment, index) => (
                <ImageListItem
                  sx={{ overflow: 'hidden' }}
                  key={attachment.images[0]}
                >
                  {attachment.images[0] ? (
                    <CldImg
                      src={attachment.images[0]}
                      alt={attachment.images[0]}
                    />
                  ) : (
                    <>
                      {index === 0 && (
                        <ReactPlayer
                          controls
                          url={attachment.videos[0]}
                          width={'100%'}
                          style={{ borderRadius: 12, overflow: 'hidden' }}
                        />
                      )}
                    </>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </>
      )}
    </Grid>
                    </Typography>
                    {/* </Link> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

  );
};

export default LensPost;
