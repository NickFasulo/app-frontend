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
import Reply from './Reply';
import Avatar from './Avatar';
import HeaderSection from './HeaderSection';

const FarCasterPost = ({ post, text, postid, attachments, classes }) => {  
  const { pathname } = useRouter();
  const web3Preview = post
  const {id} = post
 // const replyParent = useFarcasterReplyParent(post?.meta?.replyParentMerkleRoot)
  let parsedText = parseText(text);
  const parents = post.meta.parents
  const isReply = parents?.length  > 0
  // const isReplyToReply = parents.length > 1
  
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };
  if(isReply){
    return (
      <Grid item="item" xs={12}>
        <Reply classes={classes} post={post}>
          </Reply>
          </Grid>)
  }
  // else if(isReplyToReply){
  //   return <Reply></ReplyToReply>
  // } 
  else {
  return ( 
    <Grid item="item" xs={12}>
        <Grid container="container" direction="row" spacing={1}>
          <Grid item="item">
            <Avatar
              classes={classes}
              url={web3Preview.creator.avatarUrl}
              tweetLink={id}
            />
          </Grid>
          <Grid item="item" xs>
            <Grid container="container" direction="row" spacing={0}>
              <Grid item="item" xs={12}>
                <HeaderSection
                  classes={classes}
                  name={web3Preview.creator.fullname}
                  handle={web3Preview.creator.handle}
                  address={web3Preview.creator.address}
                  protocol={web3Preview.protocol}
                  replyParentUsername={
                    web3Preview.meta.replyParentUsername?.username
                  }
                  tweetLink={id}
                  createdAt={web3Preview.createdAt}
                />
              </Grid>
              <Grid item="item" xs={12}>
                <Grid container="container" spacing={1}>
                  <Grid item="item" xs={12}
                sx={{margin:'1em 0'}}>
                    {/* <Link href={tweetLink} target="_blank" underline="none"> */}
                    <Typography variant="body2">
                    <Link href={`/post/${postid}`} >
      <Grid
        item
        sx={{cursor:'pointer'}}>
      
       {/* <TruncateText align="left" variant="h2" lines={4}>
      {account.fullname || account.username || account._id}
    </TruncateText> */}
        {!isFullPost() ? (
        <TruncateText variant='body2' lines={7}>
          {parsedText}
    </TruncateText>):(
        <Typography variant="body2">
          {parsedText}
        </Typography>)}

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
                    classes={classes}
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
                    </Typography>
                    {/* </Link> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  
  );
    
}
};

export default withSuspense()(FarCasterPost);
