import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import LinkPreview from '../LinkPreview/LinkPreview';
import { CldImg } from '../Miscellaneous';
import { TruncateText } from '../styles';
import withSuspense from '../../hoc/withSuspense';
import Reply from './Reply';
import Avatar from './Avatar';
import HeaderSection from './HeaderSection';
import { parseText, linkMentions, urlIsImg } from '../../utils/post_helpers';
import { isYoutubeUrl } from '../../utils/helpers';
import VideoComponent from '../VideoComponent';

function FarCasterPost({
  post,
  text,
  postid,
  attachments,
  classes,
  showFullPost
}) {
  const web3Preview = post;
  const { id } = post;
  // const replyParent = useFarcasterReplyParent(post?.meta?.replyParentMerkleRoot)
  const parsedText = parseText(text);
  const parsedTextWithMentions = parsedText
    .split(' ')
    .map((string) => linkMentions(string, 'farcaster://profiles/'));
  console.log({ parsedTextWithMentions, parsedText });
  const { parents } = post.meta;
  const isReply = parents?.length > 0;
  // const isReplyToReply = parents.length > 1

  if (isReply) {
    return (
      <Grid item="item" xs={12}>
        <Reply classes={classes} post={post} postid={postid} />
      </Grid>
    );
  }
  // else if(isReplyToReply){
  //   return <Reply></ReplyToReply>
  // }

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
          <Grid container="container" direction="row" spacing={1}>
            <Grid item="item" xs={12}>
              <HeaderSection
                classes={classes}
                meta={web3Preview.meta}
                name={web3Preview.creator.fullname}
                handle={web3Preview.creator.handle}
                address={web3Preview.creator.address}
                protocol={web3Preview.protocol}
                tweetLink={id}
                createdAt={web3Preview.createdAt}
              />
            </Grid>
            <Grid item="item" xs={12}>
              <Grid container="container" spacing={1}>
                <Grid item="item" xs={12}>
                  <Grid
                    container="container"
                    direction="row"
                    spacing={1}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* <TruncateText align="left" variant="h2" lines={4}>
      {account.fullname || account.username || account._id}
    </TruncateText> */}

                    <Link href={`/post/${postid}`}>
                      <Grid item="item" xs={12}>
                        {showFullPost ? (
                          <TruncateText variant="body2" lines={7}>
                            {parsedTextWithMentions}
                          </TruncateText>
                        ) : (
                          <Typography variant="body2">
                            {parsedTextWithMentions}
                          </Typography>
                        )}
                      </Grid>
                    </Link>

                    <Grid item="item" xs={12}>
                      {attachments
                        ? attachments.map((attachment) => {
                            if (isYoutubeUrl(attachment.url)) {
                              return <VideoComponent url={attachment.url} />;
                            }
                            if (attachment.images[0]) {
                              return (
                                <LinkPreview
                                  size="large"
                                  description={attachment.description || ''}
                                  image={
                                    attachment.images[0]
                                      ? attachment.images[0]
                                      : attachment.url
                                  }
                                  title={attachment.title}
                                  url={attachment.url}
                                  // classes={classes}
                                />
                              );
                            }
                            if (urlIsImg(attachment.url)) {
                              return (
                                <CldImg
                                  style={{ borderRadius: '12px' }}
                                  src={attachment.url}
                                  alt={attachment.title}
                                  isWeb3Post
                                />
                              );
                            }
                          })
                        : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withSuspense()(FarCasterPost);
