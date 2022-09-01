import React from 'react';
import withStyles from '@mui/styles/withStyles';
import { Fade } from '@mui/material/';
import PropTypes from 'prop-types';

// child componenents
import Original from './Original';

const styles = (theme) => ({
  container: {
    padding: '16px 16px 0 16px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left',
    width: '100%'
  },
  twitterTag: {
    textDecoration: 'none !important',
    fontWeight: 500
  },
  replyTextWithBar: {
    textAlign: 'left',
    '&::before': {
      border: '1.2px solid #AAAAAA',
      content: " '' ",
      top: 0,
      left: -35,
      fontSize: 0,
      bottom: 2,
      width: 0,
      zIndex: 1,
      height: '92%'
    }
  },
  tweetText: {
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    wordWrap: 'break-word'
  },
  twitterName: {
    margin: 0
  },
  userHandle: {
    color: 'grey'
  },
  userAvatar: {
    width: '2.5rem',
    aspectRatio: 1 / 1,
    borderRadius: '50%',
    overflow: 'visible'
  },
  retweetContainer: {
    border: `solid 1px ${theme.palette.M500}`,
    borderRadius: '2px',
    overflow: 'hidden',
    padding: '8px'
  },
  videoTweetContainer: {
    boxShadow: '0px 0px 5px #AAAAA0',
    border: `solid 1px ${theme.palette.M300}`
  },
  retweetUserAvatar: {
    width: '1.5rem',
    borderRadius: '50%'
  },
  retweetTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  retweetTwitterBirdIcon: {
    display: 'none'
  },
  retweetVid: {
    borderRadius: '12px 0px 0px 12px'
  },
  replyTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  barDiv: {
    border: `1.2px solid ${theme.palette.M700}`,
    boxShadow: `0px -6px 0px 0px ${theme.palette.M700}, 0px 12px 0px 0px ${theme.palette.M700}`,
    borderRadius: '12px',
    content: " '' ",
    fontSize: 0,
    width: 0,
    zIndex: 1,
    height: 'calc(100% + 4px)',
    margin: 'auto',
    background: theme.palette.M700
  },
  replyLine: {
    backgroundColor: 'gray',
    width: 2,
    marginRight: 'auto',
    height: 100
  },
  mainReplyContainer: {
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    textAlign: 'left'
  },
  replyContainer: {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyOriginalContainer: {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyImageContainer: {
    color: 'white !important',
    textAlign: 'left'
  },
  LinkPreviewImageSmall: {
    height: '100%',
    borderRadius: '12px 0px 0px 12px'
  },
  LinkPreviewContentSmall: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  LinkPreviewMain: {
    maxHeight: 150,
    minHeight: 150,
    overflow: 'hidden',
    marginBottom: 25,
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 20
  },
  LinkPreviewURL: {
    color: 'gray'
  },
  LinkPreviewImageLarge: {
    width: '100%',
    borderRadius: '12px 12px 0px 0px'
  },
  LinkPreviewImageSmallContainer: {
    height: '100%'
  },
  LinkPreviewImage: {
    maxWidth: 550
  },
  LinkPreviewContentLarge: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  LinkPreviewMainLarge: {
    overflow: 'hidden',
    marginBottom: 25,
    flexDirection: 'column',
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 12
  },
  LinkPreviewAnchor: {
    color: 'inherit',
    textDecoration: 'none'
  },
  letterAvatar: {
    border: '2px solid rgb(218, 218, 218)',
    borderRadius: '100%',
    backgroundColor: 'rgba(9, 9, 9, 0.44)',
    fontFamily: 'Gilroy',
    fontWeight: '600',
    color: 'rgb(218, 218, 218)'
  }
});

function CustomWeb3PostEmbed({ postid, web3Preview, classes, showFullPost }) {
  return (
    <Fade in timeout={1000}>
      <div>
        <Original
          postid={postid}
          web3Preview={web3Preview}
          classes={classes}
          showFullPost={showFullPost}
        />
      </div>
    </Fade>
  );
}

CustomWeb3PostEmbed.propTypes = {
  web3Preview: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomWeb3PostEmbed);
