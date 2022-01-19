/* eslint-disable */
import React, { PureComponent } from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import CustomTweetEmbed  from '../CustomTweetEmbed/CustomTweetEmbed'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinkPreviewPost from './LinkPreviewPost'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import './tweet.css'

const styles = theme => ({
  postContainer: {
    transition: 'opacity 2s ease-in',
    padding: '0% 0% 0% 0%',
    minHeight: '100px',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0px'
    }
  },
  tweetEl: {
    color: 'white',
    width: 'max-content',
    fontFamily: 'Gilroy, sans-serif',
    border: 'none',
    maxWidth: '600px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '100vw'
    },
    marginLeft: '0px',
    zoom: '115%',
    marginRight: 'auto',
    marginTop: '-10px'
  }
})

class TweetPost extends PureComponent {
  render () {
    const { classes, caption, previewData, postHOC: PostHOC, tweetObject } = this.props

    const TweetComp = (_props) => (
      <div className={classes.postContainer}>
        <CustomTweetEmbed
          tweetData={tweetObject}
        />
      </div>
    )

    return (
      <ErrorBoundary>
        <PostHOC
          component={TweetComp}
          {...this.props}
        />
      </ErrorBoundary>
    )
  }
}

TweetPost.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  previewData: PropTypes.object,
  tweetObject: PropTypes.object,
  postHOC: PropTypes.element.isRequired
}

export default withStyles(styles)(TweetPost)
