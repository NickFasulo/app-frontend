import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions, urlIsImg } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { parseText } from './Util/Util';
import YupReactMarkdown from '../ReactMarkdown';

const FarCasterPost = ({text, attachments} ) => {
  return (
    <>
      <Grid item
       sx={{ "& *> a": {
        textDecoration: "none",
        color: 'white'
    }}}>
        <YupReactMarkdown>
          {attachments ? parseText(text) : text }
        </YupReactMarkdown>
      </Grid>
      {attachments ? (attachments.map((attachment) => {
      return (
        <>
          {urlIsImg(attachment.url) ? (
          <img
            src={attachment.url}
            alt={attachment.title}
          />
          ) : (
          <LinkPreview
            size={'large'}
            description={attachment.description || ''}
            image={attachment.images[0] ? attachment.images[0]: attachment.url}
            title={attachment.title}
            url={attachment.url}
          />
          )}
        </>
        )
      })) : null }
    </>
  )
}

export default FarCasterPost;
