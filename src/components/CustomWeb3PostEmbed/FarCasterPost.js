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
import { useRouter } from 'next/router';

const FarCasterPost = ({ text, postid, attachments }) => {  
  const { pathname } = useRouter();
  let parsedText = parseText(text);
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };

  console.log({parsedText, pathname}, isFullPost() )
  return (
    <>
      <Grid
        item
      >
        {/* <YupReactMarkdown> */}
        {!isFullPost() ? (
        <TextTruncate 
        line={4}
        text={parsedText}
        textTruncateChild={ 
        <Link href={`/post/${postid}`}>
        <Typography variant="body2"  sx={{ cursor:"pointer", fontStyle:'italic', color: 'gray'}}>
          See more</Typography>
    </Link>}
        />):(<>{parsedText}</>)}

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
