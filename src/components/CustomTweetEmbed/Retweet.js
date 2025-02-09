import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, Typography } from '@material-ui/core'
import TweetVidPlayer from './TweetVidPlayer'

// util
import { parseText, linkMentions, fetchLinkPreviewData } from './Util/Util'

// components
import LinkPreview from './LinkPreview'
import HeaderSection from './HeaderSection'

const Retweet = ({ tweetData, classes }) => {
const { user, retweeted_status: retweetedStatus } = tweetData.tweetInfo
const { user: retweetedUser } = retweetedStatus
const retweetExtendedEntities = tweetData.tweetInfo.retweeted_status.extended_entities ? tweetData.tweetInfo.retweeted_status.extended_entities : false

const [ previewData, setPreviewData ] = useState(null)
const { caption } = tweetData
const entities = tweetData.tweetInfo.entities ? tweetData.tweetInfo.entities : false
const entitiesURLS = (entities ? (entities.urls && entities.urls.length > 0) : false)

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const previewData = await fetchLinkPreviewData(entities.urls[0].expanded_url)
            setPreviewData(previewData)
          } catch (e) {
            console.log(e)
          }
        })()
      }
    }
  }, [])

  let retweetHasMedia
  if (retweetExtendedEntities) {
    retweetHasMedia = retweetExtendedEntities.media ? retweetExtendedEntities.media.length > 0 : false
  }

  let retweetMediaURL
  let retweetMediaType
  let retweetHasPhoto
  let retweetHasVideo

  if (retweetHasMedia) {
    retweetMediaURL = retweetExtendedEntities.media[0].media_url_https ? retweetExtendedEntities.media[0].media_url_https : false
    retweetMediaType = retweetExtendedEntities.media[0].type
    retweetHasPhoto = Boolean(retweetMediaType === 'photo')
    retweetHasVideo = Boolean(retweetMediaType === 'video' || retweetMediaType === 'animated_gif')

    if (retweetHasVideo) retweetMediaURL = retweetExtendedEntities.media[0].video_info.variants[0].url
  }

  let tweetLink
  if (tweetData.caption) {
    tweetLink = tweetData.caption
  }

  let initialText = tweetData.tweetInfo.full_text || tweetData.tweetInfo.text
  let text = parseText(initialText)
  let tweetText = text.split(' ').map((string) => linkMentions(string))

  return (
    <div className={classes.container}>

      <HeaderSection classes={classes}
        user={user}
        tweetLink={tweetLink}
      />

      { (previewData && !retweetHasMedia && !retweetMediaURL) && (<div style={{ marginTop: 20 }}>
        <LinkPreview classes={classes}
          description={previewData && previewData.description}
          image={previewData && previewData.img}
          title={previewData && previewData.title}
          url={previewData && previewData.url}
          caption={caption}
        /></div>
         )}

      <Link href={tweetLink}
        target='_blank'
        underline='none'
      >
        <div className={classes.retweetContainer}>
          <HeaderSection classes={classes}
            user={retweetedUser}
            tweetType={'retweet'}
          />
          <Typography className={classes.tweetText}
            style={{ marginBottom: 20 }}
          >{tweetText}</Typography>
          {
                  (retweetHasPhoto && retweetMediaURL)
                  ? <Typography className={classes.tweetText}>
                    <img className={classes.tweetImg}
                      src={tweetData.excludeTweet ? 'https://api.faviconkit.com/twitter.com/128' : retweetMediaURL}
                      alt='tweet-image'
                    />
                  </Typography>
                  : (retweetHasVideo && retweetMediaURL) &&
                    <TweetVidPlayer
                      url={retweetMediaURL}
                    />
                }
        </div>
      </Link>
    </div>
    )
}

Retweet.propTypes = {
  classes: PropTypes.object.isRequired,
  tweetData: PropTypes.object.isRequired
}

export default Retweet
