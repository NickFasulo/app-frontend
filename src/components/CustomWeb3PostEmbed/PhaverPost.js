import { Grid, Typography } from '@mui/material';
import Link from '../Link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { fetchLinkPreviewData, getAllLinks, linkMentions } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';

//Enables funky colors on links
const TeaPartyLink = styled('a')(
  ({ theme }) => `
    background-image: linear-gradient(270deg, #00E08E 0%, #A2CF7E 24.57%, #F0C909 50.35%, #FCA016 75.4%, #EB3650 100%)
    font-weight: 700;
    position: relative;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 300% 100%;
    `
);

const PhaverPost = ({ text, url, attachments }) => {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;

  const matches = text.match(regexMdLinks);
  matches?.forEach((element, i) => {
    text = reactStringReplace(text, element, async (match) => {
      const url = getAllLinks(match)?.[0];
      return await fetchLinkPreviewData(url);
    });
  });
  console.log({ matches }, text);

  return (
    <Grid
      item
      sx={{
        '& *> a': {
          textDecoration: 'none',
          color: 'white'
        }
      }}

      //   sx={{ "& *> a": {
      //     backgroundImage: "linear-gradient(90deg,#12c2e9,#c471ed,#12c2e9,#f64f59,#c471ed,#ebed71)",
      //     fontWeight: 700,
      //     position: "relative",
      //     color: "transparent",
      //     WebkitBackgroundClip: "text",
      //     backgroundClip: "text",
      //     backgroundSize: "300% 100%", }}}
    >
      {/* {matches?(<>{text.map((element,i) => {
           return typeof element === 'string'? 
                <ReactMarkdown 
                components={{
                    a: ({node, ...props}) => <p><br/><a  {...props} /></p>
                }}
                >
                    {text} 
                </ReactMarkdown>
            : element         

        })}</>):( 
        <ReactMarkdown>
                {text} 
            </ReactMarkdown>)} */}
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <LinkPreview
              size={'large'}
              description={'text[2]'}
              image={async () => await fetchPreview(props.href)}
              title={'text[0]'}
              url={props.href}
            />
          )
        }}
      >
        {text}
      </ReactMarkdown>
    </Grid>
  );
};
export default PhaverPost;
