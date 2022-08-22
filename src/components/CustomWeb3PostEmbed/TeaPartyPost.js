import { Grid, Typography } from '@mui/material';
import Link from '../Link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions } from '../../utils/post_helpers';

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

const TeaPartyPost = ({ text, url, attachments }) => {
  const regexMdLinks = /\B\@([\w\-]+)/gim;
  const matches = text.match(regexMdLinks);
  console.log({ matches });
  if (attachments.length > 0) {
    matches?.forEach((element, i) => {
      text = reactStringReplace(text, element, (match) => {
        return (
          <>
            {/* Disabled for now, will add it once we have our own profiles                 
                <Link href={`https://app.teaparty.life/u/${match.replace('@', '')}`}>
                 {match}
                </Link> */}
            <Typography variant="h7">{match}</Typography>
          </>
        );
      });
    });
  }
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
      {matches ? (
        <>
          {text.map((element, i) => {
            return typeof element === 'string' ? (
              <ReactMarkdown key={i}>{element}</ReactMarkdown>
            ) : (
              element
            );
          })}
        </>
      ) : (
        text
      )}
    </Grid>
  );
};
export default TeaPartyPost;
