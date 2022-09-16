import React, { Component, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import ReactPlayer from 'react-player/lazy';
import Link from '@mui/material/Link';
import axios from 'axios';
import _, { matches } from 'lodash';
import reactStringReplace from 'react-string-replace';
import { Grid, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import LinkPreview from '../components/LinkPreview/LinkPreview';
import { apiBaseUrl } from '../config';
import FarCasterPost from '../components/CustomWeb3PostEmbed/FarCasterPost';
import LensPost from '../components/CustomWeb3PostEmbed/LensPost';
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
export const convertIPFSSrcToHttps = (src) => {
  if (src.startsWith('ipfs://')) {
    src = `https://ipfs.io/ipfs/${src.substring(7)}`;
  }
  return src;
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
    str = str.replace(match, `[hashtagyupreplace${match}](${match})`);
  });
  return str;
  // const parsed = str.replace(re, '');
  // return parsed;
};
// Replacesprotocol from url so markdownReplaceLinks doenst replace it twice
export const splitMarkDownUrl = (str) => {
  const re = /http[s]?:\/\/.*?( |\n|\t|$){1}/g;
  const matches = str.match(re);
  matches?.forEach((match, i) => {
    match = decodeURIComponent(match);
    match = match.replace(/(\r\n|\n|\r)/gm, '');
    const urlObject = new URL(match);
    str = str.replace(
      urlObject.protocol,
      `${urlObject.protocol}hyperlinkyupreplace`
    );
    // url= str.replace(match, `[linkyupreplace${match}](${match})`);
  });
  return str;
};
export const markdownReplaceLinks = (str) => {
  // replaces markdown hyperlinks and adds hyperlinkyupreplace
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  const singleMatch = /\[([^\[]+)\]\((.*)\)/;
  const mdLinkMatches = str.match(regexMdLinks);
  mdLinkMatches?.forEach((match) => {
    const markdownMatches = singleMatch.exec(match);
    const text = markdownMatches[1];
    let url = markdownMatches[2];
    url = decodeURIComponent(url);
    url = url.replace(/(\r\n|\n|\r)/gm, '');
    str = str.replace(match, `[${text}](${splitMarkDownUrl(url)})`);
  });

  // replaces markdown links and adds linkyupreplace to handle it later
  const re = /http[s]?:\/\/.*?( |\n|\t|$){1}/g;
  const matches = str.match(re);
  matches?.forEach((match, i) => {
    match = decodeURIComponent(match);
    match = match.replace(/(\r\n|\n|\r)/gm, '');
    console.log({ str }, 'BEFORE');
    str = str.replace(match, `[linkyupreplace${match}](${match})`);
  });
  return str;
};
export const parsePhaverText = (str, linkPreview) => {
  const { description, title, image } = linkPreview;
  const re = /\[([^\[]+)\](\(.*\))/gm;
  const matches = str.match(re);
  str = str.replace(description, '');
  matches?.forEach((match, i) => {
    // match = decodeURIComponent(match)
    // match = match.replace(/(\r\n|\n|\r)/gm,"");
    // console.log({str}, 'BEFORE')
    if (match.includes(title)) {
      str = str.replace(match, '');
    }
  });
  console.log({ str, description }, 'WURST');
  return str;
};
// Converts http://www.example.com/page1/resource1 into --> example.com
export const linkMentions = (word, url) => {
  const { palette } = useTheme();
  const re = /\B\@([\w\-]+)/gim;
  const hashtagRe = /\B(\#[a-zA-Z]+\b)(?!;)/gm;
  const matchHastag = hashtagRe.test(word);
  const match = re.test(word);
  const userLink = url + word;
  if (match) {
    word = parseTags(word);
    return (
      <>
        <Typography variant="body3" display="inline">
          {word}
        </Typography>
        <i> </i>
      </>
    );
  }
  if (matchHastag) {
    return (
      <>
        <Typography variant="body3" display="inline">
          {word}
        </Typography>
        <i> </i>
      </>
    );
  }
  return <>{word} </>;
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
  console.log(url, match, 'TEST');
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
      text = reactStringReplace(text, element, () => attachments[i]);
    });

    return (
      <LinkPreview
        size="large"
        description={text[2]}
        image={text[1]}
        title={text[0]}
        url={url}
      />
    );
  }
  return text;
};

export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)}y`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)}m`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)}d`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)}h`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)}min`;
  }
  return `${Math.floor(seconds)}s`;
};
