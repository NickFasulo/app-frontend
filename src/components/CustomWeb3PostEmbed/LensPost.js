import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import {
  fetchLinkPreviewData,
  getAllLinks,
  getNameInBrackets,
  linkMentions
} from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { SeeMore } from '../Miscellaneous';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import YupReactMarkdown from '../ReactMarkdown';

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

const LensPost = ({ postid, text, url, attachments }) => {
  const { pathname } = useRouter();

  const multipleAttachments = () => {
    return attachments.length > 1 && attachments[0].images.length > 0;
  };

  const imageListHeight = () => {
    if (attachments.length === 2) {
      if (!attachments[0].images.length > 0) {
        return 164;
      }
    }
    return 450;
  };
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };

  console.log({ pathname }, isFullPost());
  //Uncomment to get LinkPreviews

  // const getLinkPreviews  = () => {
  //   const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm
  //   console.log({text}, "WURST")
  //     const matches = text.match(regexMdLinks)
  //     if(attachments){
  //         if(matches){
  //             matches?.forEach((element,i) => {
  //               text = reactStringReplace(text, element, (match) => {
  //                 const url = getAllLinks(match)?.[0]
  //                 const name = getNameInBrackets(match)?.[0]

  //                console.log({match, text, matches},getNameInBrackets(match))
  //                 // const data = await fetchLinkPreviewData(url)
  //                 // console.log(url, data, "MATCHHH")

  //                 return <LinkPreview
  //                 size={'large'}
  //                 image={text[1]}
  //                 title={name}
  //                 url={url}
  //                 />
  //             });
  //             });
  //         }

  //     }
  // }
  //Parses md links like [link_name](link_url) and returns a Link preview for those

  // getLinkPreviews()
  // useEffect(() => {
  //   console.log("RUNNING")
  //   getLinkPreviews()
  // }, [])

  return (
    <Grid
      item
      sx={{
        '& *> a': {
          textDecoration: 'none',
          color: 'white'
        }
      }}
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
      {Array.isArray(text) ? (
        <>
          {text.map((element, i) => {
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
          {isFullPost() ? (
            <YupReactMarkdown>{text}</YupReactMarkdown>
          ) : (
            <SeeMore lines={attachments ? 3 : 6} postid={postid}>
              {text}
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
                    <img
                      // height={multipleAttachments()?164:450}
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
  );
};

export default LensPost;
