
import React, { Component, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import ReactPlayer from 'react-player/lazy';
import Link from '@mui/material/Link';
import axios from 'axios';
import _ from 'lodash';
import { apiBaseUrl } from '../../../config';
import LinkPreview from '../../LinkPreview/LinkPreview';
import reactStringReplace from 'react-string-replace';
import { Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import TeaPartyPost from '../TeaPartyPost';
import FarCasterPost from '../FarCasterPost';
/**
 * - Removes https://t.co/ERYj5p9VHj that comes at end of text field in tweetData object if present
 * - Replaces '&amp;' with '&'
 * - Replaces '&nbsp;' with ' '
 *
 * @param {*} str text string to parse
 */
export const parseText = (str) => {
  const re = /http\S+/;
  const parsed = str
    .replace(re, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
  return parsed;
};

// Removes : and - after @tag (if someone types @myusername: it changes it to @myusername
export const parseTags = (str) => {
  const re = /[:-]/;
  const parsed = str.replace(re, '');
  return parsed;
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
          target="_blank" rel="noreferrer"
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

export const parseWeb3Post = (post) => {
  const { content, urls, attachments} = post
  let parsedPost 
  switch (post.appId) {
    case 'phaver':
      parsedPost = parsePhaverPost(content, urls[0], attachments[0].images);
      break
    case 'teaparty':
      parsedPost = <TeaPartyPost text={content} url={urls[0]} previews={attachments[0].images}/>;
      break
    default:
    parsedPost = <FarCasterPost text={content}  attachments={attachments}/>
    // parsedPost = post.content
  }
  console.log(parsedPost, 'parsedPost')
  return parsedPost
}

export const parsePhaverPost = (text, url, previews) => {  
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm 
  console.log(regexMdLinks[2], 'DESCRIPTION')
  console.log(regexMdLinks[0], 'TITLE')
  console.log(regexMdLinks[1], 'MATCH')
  
  const matches = text.match(regexMdLinks)
  matches?.forEach((element,i) => {
    text = reactStringReplace(text, element, () => {
      return previews[i]
  }); 
  });
  
  console.log(text, 'WURST')
  return <LinkPreview
  size={'large'}
  description={text[2]}
  image={text[1]}
  title={text[0]}
  url={url}
  />
}