import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import PostHOC from './PostHOC';
import TextPost from './TextPost';
import LinkPreviewPost from './LinkPreviewPost';
import ArticlePost from './ArticlePost';
import CoursePost from './CoursePost';
import ProfPost from './ProfPost';
import TweetPost from './TweetPost';
import Web3Post from './Web3Post';
import VideoPost from './VideoPost';
import SoundPost from './SoundPost';
import SpotifyPost from './SpotifyPost';
import MusicPost from './MusicPost';
import EventPost from './EventPost';
import TallPreviewPost from './TallPreviewPost';
import ObjectPost from './ObjectPost';
import NFTPost from './NFTPost';
import TwitchPost from './TwitchPost';
import InstagramPost from './InstagramPost';
import AudiusPost from './AudiusPost';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { isYoutubeUrl } from '../../utils/helpers';
import { useRefetchPostPreview } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';
import { FunctionalErrorBoundary } from '../ErrorBoundary/FunctionalErrorBoundary';

const COLUMBIA_PROF_TAG = 'columbia-course-registration/professor';
const COLUMBIA_COURSE_TAG = 'columbia-course-registration/course';

const COLUMBIA_PROF_POST_TYPE = 'columbia-course-registration:professors';
const COLUMBIA_COURSE_POST_TYPE = 'columbia-course-registration:courses';

const MAPS_POST_TYPE = 'maps.google.com';

const US_PRES_ELECTIONS_TAG = 'politics';

function genRegEx(arrOfURLs) {
  return new RegExp(
    `^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`
  );
}

function isAudiusPost(url) {
  const audiusPattern = genRegEx(['audius.co/*']);
  return audiusPattern.test(url);
}

function isObjectPost(url) {
  const objPattern = genRegEx([
    'wikipedia.org/wiki/*',
    'wikipedia.com/*',
    'en.wikipedia.org/*',
    'amazon.com/*',
    'twitter.com/[^/]*$',
    'reddit.com/r/[^/]*[/]?$',
    'youtube.com/channel/[^/]*[/]?$',
    'youtube.com/user/[^/]*[/]?$',
    'rally.io/creator/[^/]*$'
  ]);
  return objPattern.test(url);
}

function isChannelPost(url) {
  const ytPattern = genRegEx([
    'youtube.com/c?',
    'youtube.com/user?',
    'youtube.com/channel?'
  ]);
  return ytPattern.test(url);
}

function isSoundPost(url) {
  const scPattern = genRegEx(['soundcloud.com/*']);
  return scPattern.test(url);
}

function isSpotifyPost(url) {
  const spPattern = genRegEx(['open.spotify.com/*']);
  return spPattern.test(url);
}

function isMusicPost(url) {
  const appleMusicRe = genRegEx(['music.apple.com/us/(artist|album)/*']);
  return appleMusicRe.test(url);
}

function isTallPost(url) {
  const tallPattern = genRegEx(['giphy.com/*', 'app.yup.io/collections/*']);
  return tallPattern.test(url);
}

function isInstagramPost(url) {
  const igPattern = genRegEx(['instagram.com/*']);
  return igPattern.test(url);
}

function isTwitchPost(url) {
  const twPattern = genRegEx(['twitch.tv/*']);
  return twPattern.test(url);
}

function isArticlePost(url) {
  const atPattern = genRegEx(['forum.yup.io/*/*', '.*.mirror.xyz/*']);
  return atPattern.test(url);
}

function isTwitterPost(url) {
  const twitterPattern = genRegEx([
    'twitter.com/.*/status/',
    'mobile.twitter.com/.*/status/'
  ]);
  return twitterPattern.test(url);
}

function isNFTPost(url) {
  const nftPattern = genRegEx([
    'rarible.com/*',
    'app.rarible.com/*',
    'opensea.io/assets/*',
    'opensea.io/collection/*',
    'superrare.co/*',
    'superrare.co/*',
    'foundation.app/*/',
    'zora.co/*',
    'knownorigin.io/gallery/*'
  ]);
  return nftPattern.test(url);
}

function isWeb3Post(tag) {
  return ['farcaster', 'lens'].includes(tag);
}

function isEventPost(tag) {
  const eventPattern = genRegEx(['poap']);
  return eventPattern.test(tag);
}

const PostController = ({
  classes,
  post,
  hideInteractions,
  renderObjects,
  showFullPost
}) => {
  useRefetchPostPreview(post, post._id.postid);
  if (!post) return null;

  const isTextPost =
    (post.imgHash == null || post.imgHash.trim() === '') &&
    (post.videoHash == null || post.videoHash.trim() === '');

  if (post.tag === COLUMBIA_PROF_TAG) {
    return (
      <FunctionalErrorBoundary>
        <ProfPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          previewData={post.previewData}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          postType={COLUMBIA_PROF_POST_TYPE}
          hideInteractions={hideInteractions}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (post.tag === COLUMBIA_COURSE_TAG) {
    return (
      <FunctionalErrorBoundary>
        <CoursePost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          previewData={post.previewData}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          rating={post.rating}
          postHOC={PostHOC}
          postType={COLUMBIA_COURSE_POST_TYPE}
          hideInteractions={hideInteractions}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (post.tag === US_PRES_ELECTIONS_TAG) {
    return (
      <FunctionalErrorBoundary>
        <TweetPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          previewData={post.previewData}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          tweetObject={post}
          postType={US_PRES_ELECTIONS_TAG}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isTwitterPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <TweetPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          previewData={post.previewData}
          tweetObject={post}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isWeb3Post(post.tag)) {
    return (
      <FunctionalErrorBoundary>
        <Web3Post
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          web3Preview={post.web3Preview}
          tweetObject={post}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
          showFullPost={showFullPost}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isEventPost(post.tag)) {
    return (
      <FunctionalErrorBoundary>
        <EventPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          web3Preview={post.web3Preview}
          tweetObject={post}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isYoutubeUrl(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <VideoPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isSoundPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <SoundPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isSpotifyPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <SpotifyPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isMusicPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <MusicPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isTwitchPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <TwitchPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isInstagramPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <InstagramPost
          post={post}
          url={post.url}
          comment={post.comment}
          author={post.author}
          postid={post._id.postid}
          previewData={post.previewData}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isNFTPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <NFTPost
          post={post}
          comment={post.comment}
          key={post._id.postid}
          postid={post._id.postid}
          author={post.author}
          url={post.url}
          previewData={post.previewData}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isTallPost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <TallPreviewPost
          post={post}
          comment={post.comment}
          key={post._id.postid}
          postid={post._id.postid}
          author={post.author}
          url={post.url}
          previewData={post.previewData}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isArticlePost(post.url)) {
    return (
      <FunctionalErrorBoundary>
        <ArticlePost
          post={post}
          comment={post.comment}
          key={post._id.postid}
          postid={post._id.postid}
          author={post.author}
          url={post.url}
          previewData={post.previewData}
          web3Preview={post.web3Preview}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          hideInteractions={hideInteractions}
          classes={classes}
          showFullPost={showFullPost}
        />
      </FunctionalErrorBoundary>
    );
  }
  if (isObjectPost(post.url) || isChannelPost(post.url)) {
    if (renderObjects) {
      return (
        <FunctionalErrorBoundary>
          <ObjectPost
            post={post}
            comment={post.comment}
            key={post._id.postid}
            postid={post._id.postid}
            author={post.author}
            url={post.url}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </FunctionalErrorBoundary>
      );
    }
    return null;
  }
  if (isTextPost) {
    if (post.previewData == null) {
      return (
        <FunctionalErrorBoundary>
          <TextPost
            post={post}
            url={post.url}
            comment={post.comment}
            key={post._id.postid}
            author={post.author}
            postid={post._id.postid}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            postType={post.tag === MAPS_POST_TYPE ? MAPS_POST_TYPE : null}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </FunctionalErrorBoundary>
      );
    }
    if (isAudiusPost(post.url)) {
      return (
        <FunctionalErrorBoundary>
          <AudiusPost
            post={post}
            url={post.url}
            comment={post.comment}
            key={post._id.postid}
            author={post.author}
            postid={post._id.postid}
            previewData={post.previewData}
            quantiles={post.quantiles}
            votes={post.upvotes - post.downvotes}
            weights={post.weights}
            postHOC={PostHOC}
            rating={post.rating}
            hideInteractions={hideInteractions}
            classes={classes}
          />
        </FunctionalErrorBoundary>
      );
    }
    return (
      <FunctionalErrorBoundary>
        <LinkPreviewPost
          post={post}
          comment={post.comment}
          key={post._id.postid}
          postid={post._id.postid}
          author={post.author}
          url={post.url}
          previewData={post.previewData}
          quantiles={post.quantiles}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={PostHOC}
          rating={post.rating}
          hideInteractions={hideInteractions}
          classes={classes}
        />
      </FunctionalErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <Post
        post={post}
        url={post.url}
        comment={post.comment}
        image={post.imgHash}
        key={post._id.postid}
        author={post.author}
        postid={post._id.postid}
        quantiles={post.quantiles}
        video={post.videoHash}
        votes={post.upvotes - post.downvotes}
        weights={post.weights}
        postHOC={PostHOC}
        rating={post.rating}
        hideInteractions={hideInteractions}
        classes={classes}
      />
    </ErrorBoundary>
  );
};

PostController.propTypes = {
  post: PropTypes.object.isRequired,
  showFullPost: PropTypes.bool,
  hideInteractions: PropTypes.bool,
  renderObjects: PropTypes.bool,
  classes: PropTypes.object.isRequired
};
PostController.defaultProps = {
  showFullPost: false,
  hideInteractions: false,
  renderObjects: false
};
export default withSuspense()(memo(PostController));
