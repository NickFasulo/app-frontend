import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Fade } from '@material-ui/core/'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

// child componenents
import Reply from './Reply'
import Retweet from './Retweet'
import Quoted from './Quoted'
import Original from './Original'

const styles = (theme) => ({
  container: {
    padding: '16px',
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
    padding: '10px 0px',
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
    padding: 0,
    margin: 0
  },
  twitterHandle: {
    color: 'grey'
  },
  userAvatarContainer: {
    paddingRight: '10px'
  },
  userAvatar: {
    width: '3rem',
    aspectRatio: 1 / 1,
    borderRadius: '50%'
  },
  tweetImg: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0px 0px 5px #AAAAAAA0'
  },
  retweetContainer: {
    border: `solid 1px ${theme.palette.alt.fifth}`,
    borderRadius: '12px'
  },
  videoTweetContainer: {
    boxShadow: '0px 0px 5px #AAAAA0',
    border: `solid 1px ${theme.palette.common.third}`
  },
  retweetUserAvatar: {
    width: '2rem',
    borderRadius: '50%'
  },
  retweetTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  retweetTwitterBirdIcon: {
    display: 'none'
  },
  replyTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  barDiv: {
    border: '1.2px solid #AAAAAA',
    content: " '' ",
    top: 0,
    left: -35,
    fontSize: 0,
    bottom: 2,
    width: 0,
    zIndex: 1,
    height: '92%',
    margin: 'auto',
    background: '#AAAAAA'
  },
  replyLine: {
    backgroundColor: 'gray',
    width: 2,
    marginRight: 'auto',
    padding: 0,
    height: 100
  },
  mainReplyContainer: {
    padding: '15px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left',
    width: '100%'
  },
  replyContainer: {
    padding: '15px',
    paddingTop: '0px',
    paddingLeft: '0px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyOriginalContainer: {
    padding: '12px',
    paddingTop: '0px',
    paddingLeft: '0px',
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
    paddingLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 10
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
  LinkPreviewText: {
    padding: '10px 0px'
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
    justifyContent: 'space-evenly',
    padding: 20
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
    color: 'rgb(218, 218, 218)',
    padding: '0 5px 0 5px'
  }
})

class CustomTweetEmbed extends Component {
  render () {
    const { tweetData, classes } = this.props
    if (!tweetData || !tweetData.tweetInfo) {
      return <div />
    }
    const retweet = tweetData.tweetInfo.retweeted_status ? !(isEmpty(tweetData.tweetInfo.retweeted_status)) : false
    const quoted = tweetData.tweetInfo.quoted_status ? !(isEmpty(tweetData.tweetInfo.quoted_status)) : false
    const reply = tweetData.tweetInfo.in_reply_to_status_id ? !(isEmpty(tweetData.tweetInfo.reply_status)) : false

    return (
      <Fade in
        timeout={1000}
      >
        {
          retweet
          ? <Retweet tweetData={tweetData}
            classes={classes}
            />
          : quoted
          ? <Quoted tweetData={tweetData}
            classes={classes}
            />
          : reply
          ? <Reply tweetData={tweetData}
            classes={classes}
            />
          : <Original tweetData={tweetData}
            classes={classes}
            />
        }
      </Fade>
    )
  }
}

CustomTweetEmbed.propTypes = {
  tweetData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CustomTweetEmbed)
