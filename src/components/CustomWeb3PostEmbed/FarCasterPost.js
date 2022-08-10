import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import React, {useState} from 'react';
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
import { TruncateText } from '../styles';
import { useFarcasterReplyParent } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';

const FarCasterPost = ({ post, text, postid, attachments }) => {  
  const { pathname } = useRouter();
  const replyParent = useFarcasterReplyParent(post?.meta?.replyParentMerkleRoot)
  let parsedText = parseText(text);
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };

  return ( 
  <Link href={`/post/${postid}`} >
      <Grid
        item
        sx={{cursor:'pointer'}}>
      
       {/* <TruncateText align="left" variant="h2" lines={4}>
      {account.fullname || account.username || account._id}
    </TruncateText> */}
        {!isFullPost() ? (
        <TruncateText variant='body2' lines={4}>
        <YupReactMarkdown>
      {parsedText}
      </YupReactMarkdown>
    </TruncateText>):(
        <YupReactMarkdown>{parsedText}
        </YupReactMarkdown>)}

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
      
      </Link>
  );
};

export default withSuspense()(FarCasterPost);
