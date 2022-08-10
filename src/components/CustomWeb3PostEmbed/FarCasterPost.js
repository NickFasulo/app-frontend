import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import { linkMentions, urlIsImg } from './Util/Util';
import LinkPreview from '../LinkPreview/LinkPreview';
import { parseText } from './Util/Util';
import YupReactMarkdown from '../ReactMarkdown';
import { SeeMore } from '../Miscellaneous';
import TextTruncate from 'react-text-truncate';

const FarCasterPost = ({ text, postid, attachments }) => {
  return (
    <>
      <Grid
        item
      >
        {/* <YupReactMarkdown> */}
        <TextTruncate 
        line={3}
        text={text}
        textTruncateChild={ <Link href={`/post/${postid}`}>
        <Typography variant="body2"  sx={{ cursor:"pointer", fontStyle:'italic', color: 'gray'}}>
          See more</Typography>
    </Link>}
        />

          <>     
          {attachments
        ? attachments.map((attachment) => {
            return (
              <>
                {urlIsImg(attachment.url) ? (
                  <img
                    style={{ width: '100%', borderRadius: '12px' }}
                    src={attachment.url}
                    alt={attachment.title}
                  />
                ) : (
                  <LinkPreview
                    size={'large'}
                    description={attachment.description || ''}
                    image={
                      attachment.images[0]
                        ? attachment.images[0]
                        : attachment.url
                    }
                    title={attachment.title}
                    url={attachment.url}
                  />
                )}
              </>
            );
          })
        : null}
          </>
        {/* {attachments ? parseText(text) : text }
        </YupReactMarkdown> */}
      </Grid>
      
    </>
  );
};

export default FarCasterPost;
