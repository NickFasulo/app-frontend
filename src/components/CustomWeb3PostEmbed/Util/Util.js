import React, { Component, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import ReactPlayer from 'react-player/lazy';
import Link from '@mui/material/Link';
import axios from 'axios';
import _, { matches } from 'lodash';
import { apiBaseUrl } from '../../../config';
import LinkPreview from '../../LinkPreview/LinkPreview';
import reactStringReplace from 'react-string-replace';
import { Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import TeaPartyPost from '../TeaPartyPost';
import FarCasterPost from '../FarCasterPost';
import { SeeMore } from '../../Miscellaneous';
import LensPost from '../LensPost';
import PhaverPost from '../PhaverPost';
/**
 * - Removes https://t.co/ERYj5p9VHj that comes at end of text field in tweetData object if present
 * - Replaces '&amp;' with '&'
 * - Replaces '&nbsp;' with ' '
 *
 * @param {*} str text string to parse
 */
export const parseText = (str) => {
  const re = /http\S+/g;
  const parsed = str
    .replace(re, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
  return parsed;
};

// Removes : and - after @tag (if someone types @myusername: it changes it to @myusername
export const parseTags = (str) => {
  const re = /[:-]/;
  const parsed = str.replace(re, '');
  return parsed;
};

// Replaces #tag with [yuphashtag#tag](url)
export const markdownReplaceHashtags = (str) => {
  const re = /\B(\#[a-zA-Z]+\b)(?!;)/gm;
  const matches = str.match(re);
  matches?.forEach((match, i) => {
    str = str.replace(match, `[${match}](${match})`);
  });
  return str;
  // const parsed = str.replace(re, '');
  // return parsed;
};

// Converts http://www.example.com/page1/resource1 into --> example.com
export const linkMentions = (word) => {
  const { palette } = useTheme();
  const re = /\B\@([\w\-]+)/gim;
  const match = re.test(word);
  if (match) {
    word = parseTags(word);
    const userLink = `https://twitter.com/${word}`;
    return (
      <>
        <a
          style={{
            color: palette.M100,
            textDecoration: 'none',
            fontWeight: 600
          }}
          href={userLink}
          target="_blank"
          rel="noreferrer"
        >
          {word}
        </a>
        <i> </i>
      </>
    );
  } else {
    return <>{word} </>;
  }
};

export const fetchLinkPreviewData = async (passedURL) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/posts/linkpreview`, {
      params: {
        url: passedURL
      }
    });
    const { previewData } = res.data;
    return previewData;
  } catch (e) {
    console.log(e);
  }
};
export const urlIsImg = (url) => {
  const re = /\.(jpeg|jpg|gif|png)$/;
  const match = re.test(url);
  return match;
};
export const getAllLinks = (text) => {
  const re =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  const matches = text.match(re);
  return matches;
};

export const getNameInBrackets = (text) => {
  const re = /(?<=\[).+?(?=\])/g;
  const matches = text.match(re);
  return matches;
};

export const parseWeb3Post = (post, postid, classes) => {
  const { content, urls, attachments, linkPreview } = post;
  let parsedPost;
  if (post.protocol === 'lens') {
    parsedPost = (
      <LensPost
        text={content}
        url={urls[0]}
        attachments={attachments}
        postid={postid}
        linkPreview={linkPreview}
        post={post}
      />
    );
    // switch (post?.meta?.metadata?.appId) {
    //   case 'phaver':
    //     parsedPost = <PhaverPost text={content} url={urls[0]} attachments={attachments}/>;
    //     break
    //   case 'teaparty':
    //     parsedPost = <TeaPartyPost text={content} url={urls[0]} attachments={attachments}/>;
    //     break
    //   default:
    //   parsedPost = <LensPost text={content} url={urls[0]} attachments={attachments} postid={postid}/>
    //   // parsedPost = post.content
    // }
  } else {
    parsedPost = (
      <FarCasterPost
        text={content}
        attachments={attachments}
        postid={postid}
        post={post}
        classes={classes}
      />
    );
  }
  console.log(parsedPost, 'parsedPost');
  return parsedPost;
};

export const parsePhaverPost = (text, url, attachments) => {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  console.log(regexMdLinks[2], 'DESCRIPTION');
  console.log(regexMdLinks[0], 'TITLE');
  console.log(regexMdLinks[1], 'MATCH');

  const matches = text.match(regexMdLinks);
  if (attachments.length > 0) {
    matches?.forEach((element, i) => {
      text = reactStringReplace(text, element, () => {
        return attachments[i];
      });
    });

    return (
      <LinkPreview
        size={'large'}
        description={text[2]}
        image={text[1]}
        title={text[0]}
        url={url}
      />
    );
  } else {
    return text;
  }
};

export const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + 'y';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + 'm';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + 'd';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'min';
  }
  return Math.floor(seconds) + 's';
};
