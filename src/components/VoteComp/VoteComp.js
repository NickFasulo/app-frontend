import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import VoteButton from '../VoteButton/VoteButton';
import { useInitialVotes, useYupAccount } from '../../hooks/queries';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { apiBaseUrl } from '../../config';
import useToast from '../../hooks/useToast';
import { parseError } from '../../eos/error';
import rollbar from '../../utils/rollbar';
import { createVote, editVote, deleteVote } from '../../apis';
import { FlexBox } from '../styles';
import { windowExists } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { postEvent } from '../../apis/general';

const CREATE_VOTE_LIMIT = 40;
const ratingConversion = {
  1: 2,
  2: 1,
  3: 1,
  4: 2,
  5: 3
};
const dislikeRatingConversion = {
  2: 1,
  1: 2
};
const likeRatingConversion = {
  1: 3,
  2: 4,
  3: 5
};

function genRegEx(arrOfURLs) {
  return new RegExp(
    `^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`
  );
}
const getWeb3Likes = (postInfo) => {
  if (postInfo.post.web3Preview?.protocol === 'farcaster') {
    return postInfo.post.web3Preview?.meta?.reactions.count;
  }
  if (postInfo.post.web3Preview?.protocol === 'lens') {
    return postInfo.post.web3Preview?.meta?.metadata.stats.totalUpvotes;
  }

  return 0;
};

const getWeb3Dislikes = (postInfo) => {
  if (postInfo.post.web3Preview?.protocol === 'farcaster') {
    return 0;
  }
  if (postInfo.post.web3Preview?.protocol === 'lens') {
    return postInfo.post.web3Preview?.meta?.metadata.stats.totalDownvotes;
  }

  return 0;
};
function VoteComp({ postid, url, weights, postInfo, rating }) {
  const { authInfo, name } = useAuth();
  const { data: account } = useYupAccount(name);
  const { data: votes } = useInitialVotes(postid, name);
  const vote = votes?.[0];
  const [newRating, setNewRating] = useState();
  const [lastClicked, setLastClicked] = useState();
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [hasNewUpvote, setHasNewUpvote] = useState(false);
  const [hasNewDownvote, setHasNewDownvote] = useState(false);
  const [hasOldUpvote, setHasOldUpvote] = useState(vote?.like && vote.rating);
  const [hasOldDownvote, setHasOldDownvote] = useState(
    vote && !vote.like && vote.rating
  );
  const [hasOldUpvoteRemoved, setHasOldUpvoteRemoved] = useState();
  const [hasOldDownvoteRemoved, setHasOldDownvoteRemoved] = useState();
  const { toastError } = useToast();
  const category = 'overall';
  const { post } = postInfo;
  useEffect(() => {
    let timer1;
    if (newRating && lastClicked) {
      timer1 = setTimeout(() => setShouldSubmit(true), 1 * 1000);
    }
    return () => {
      setShouldSubmit(false);
      clearTimeout(timer1);
    };
  }, [newRating, lastClicked]);

  useEffect(() => {
    if (shouldSubmit) handleDefaultVote();
  }, [shouldSubmit]);

  useEffect(() => {
    if (lastClicked) {
      if (lastClicked === 'like') {
        if (hasOldDownvote && !hasOldDownvoteRemoved) {
          setHasOldDownvoteRemoved(true);
          setDownvotes((prev) => prev - 1);
        }
        if (hasOldUpvote && hasOldUpvoteRemoved) {
          setHasOldUpvoteRemoved(true);
          setUpvotes((prev) => prev + 1);
        }
        setHasNewUpvote(ratingConversion[newRating]);
        setHasNewDownvote(0);
      } else {
        if (hasOldUpvote && !hasOldUpvoteRemoved) {
          setHasOldUpvoteRemoved(true);
          setUpvotes((prev) => prev - 1);
        }
        if (hasOldDownvote && hasOldDownvoteRemoved) {
          setHasOldDownvoteRemoved(true);
          setDownvotes((prev) => prev + 1);
        }
        setHasNewDownvote(ratingConversion[newRating]);
        setHasNewUpvote(0);
      }
    }
  }, [newRating, lastClicked]);

  useEffect(() => {
    setUpvotes(post.rawPositiveWeight ?? post.positiveWeight ?? 0);
    setDownvotes(post.rawNegativeWeight ?? post.negativeWeight ?? 0);
  }, []);

  const fetchActionUsage = async (eosname) => {
    try {
      const resData = (
        await axios.get(`${apiBaseUrl}/accounts/actionusage/${eosname}`)
      ).data;
      return resData;
    } catch (err) {
      console.error('Failed to fetch action usage', err);
    }
  };
  const decreaseRating = () => {
    setNewRating((prevRating) => {
      if (prevRating < 1) return;
      if (!prevRating || prevRating > 2) {
        return 2;
      }
      if (prevRating > 1) {
        return prevRating - 1;
      }
      return 1;
    });
  };
  const increaseRating = () => {
    setNewRating((prevRating) => {
      if (prevRating > 5) return;
      if (!prevRating || prevRating < 3) {
        return 3;
      }
      if (prevRating < 5) {
        return prevRating + 1;
      }
      return 5;
    });
  };
  const isMobile = windowExists() ? window.innerWidth <= 600 : false;
  const voterWeight = 0;

  const handleDefaultVote = async () => {
    await handleVote(rating, newRating);
  };

  const submitVote = async (prevRating, newRating, ignoreLoading) => {
    // // Converts 1-5 rating to like/dislike range
    const rating = ratingConversion[newRating];
    const like = newRating > 2;
    if (vote == null || vote._id == null) {
      if (postid) {
        const sucessVote = await createVote({
          postid,
          voter: name,
          like,
          rating,
          authInfo
        });
        postEvent({
          eventData: { voteId: sucessVote._id.voteid },
          eventType: 'vote',
          accountId: authInfo.eosname,
          ...authInfo
        });
      } else {
        const sucessVote = await createVote({
          url,
          voter: name,
          like,
          rating,
          authInfo
        });
        postEvent({
          eventData: { voteId: sucessVote._id.voteid },
          eventType: 'vote',
          accountId: authInfo.eosname,
          ...authInfo
        });
      }
    }
    // //If already voted on, and new rating is the same as old rating -> Deletes existing vote
    else if (vote && prevRating === newRating) {
      await deleteVote({ voteId: vote._id.voteid, authInfo });
      postEvent({
        eventData: { voteId: vote._id.voteid },
        eventType: 'vote',
        accountId: authInfo.eosname,
        ...authInfo
      });
    }
    // //If already voted on, and new rating is different as old rating -> Updates existing vote
    else {
      await editVote({
        voter: name,
        voteId: vote._id.voteid,
        like,
        rating,
        authInfo
      });
      postEvent({
        eventData: { voteId: vote._id.voteid },
        eventType: 'vote',
        accountId: authInfo.eosname,
        ...authInfo
      });
    }
  };

  const submitForcedVote = async (prevRating, newRating) => {
    try {
      const actionUsage = await fetchActionUsage(name);
      const lastReset = new Date(actionUsage.lastReset).getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      // Check if there are votes remaining for current period
      if (
        actionUsage == null ||
        now >= lastReset + dayInMs ||
        CREATE_VOTE_LIMIT > actionUsage.createVoteCount
      ) {
        let forcedVoteRating;
        const highestLike = 3;
        const highestDislike = 2;
        const remainingVotes = CREATE_VOTE_LIMIT - actionUsage.createVoteCount;
        let highestPossibleRating;
        if (newRating > 2) {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestLike
          );
          // TODO: Throw if the remaining votes is 0
          forcedVoteRating = likeRatingConversion[highestPossibleRating];
        } else {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestDislike
          );
          forcedVoteRating = dislikeRatingConversion[highestPossibleRating];
        }
        await submitVote(prevRating, forcedVoteRating, true);
        return;
      }
      toastError("You've run out of likes for the day");
    } catch (error) {
      toastError(parseError(error, 'vote'));
    }
  };

  const handleVote = async (prevRating, newRating) => {
    try {
      await submitVote(prevRating, newRating);
    } catch (error) {
      const actionLimitExc = /Action limit exceeded/gm;
      const jsonStr = typeof error === 'string' ? error : JSON.stringify(error);

      // Submit forced vote if action limit will be exceeded
      if (jsonStr.match(actionLimitExc)) {
        await submitForcedVote(prevRating, newRating);
        return;
      }
      console.log({ error });
      toastError(parseError(error, 'vote'));
      rollbar.error(
        `WEB APP VoteButton handleVote() ${JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2
        )}:\n` + `Post ID: ${postid}, Account: ${name}, Category: ${category}`
      );
      console.error(
        `WEB APP VoteButton handleVote() ${JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2
        )}:\n` + `Post ID: ${postid}, Account: ${name}, Category: ${category}`
      );
    }
  };

  return (
    <ErrorBoundary>
      <FlexBox sx={{ columnGap: (theme) => theme.spacing(3) }}>
        <VoteButton
          userInfluence={account?.weight ?? 1}
          category={category}
          catWeight={weights[category]}
          handleOnclick={increaseRating}
          setLastClicked={() => setLastClicked('like')}
          type="like"
          totalVoters={
            upvotes
            // +
            // (lastClicked === 'like' ? ratingConversion[newRating] : 0) -
            // (lastClicked && vote?.like ? vote.rating : 0)
          }
          rating={
            lastClicked === 'like'
              ? hasOldUpvote
                ? hasNewUpvote
                  ? hasNewUpvote - 1
                  : hasOldUpvote - 1
                : hasNewUpvote || hasOldUpvote
              : 0
          }
          postid={postid}
          isShown={!isMobile}
          isVoted={lastClicked === 'like' || (!lastClicked && vote?.like)}
          postInfo={postInfo}
          web3Likes={getWeb3Likes(postInfo)}
        />
        <VoteButton
          userInfluence={account?.weight ?? 1}
          category={category}
          catWeight={weights[category]}
          handleOnclick={decreaseRating}
          type="dislike"
          setLastClicked={() => setLastClicked('dislike')}
          totalVoters={
            downvotes
            // +
            // (lastClicked === 'dislike' ? ratingConversion[newRating] : 0) -
            // (lastClicked && vote && !vote.like ? vote.rating : 0)
          }
          rating={
            lastClicked === 'dislike'
              ? hasOldDownvote
                ? hasNewDownvote
                  ? hasNewDownvote - 1
                  : hasOldDownvote - 1
                : hasNewDownvote || hasOldDownvote
              : 0
          }
          postid={postid}
          isShown={!isMobile}
          isVoted={
            lastClicked === 'dislike' || (!lastClicked && vote && !vote.like)
          }
          postInfo={postInfo}
          web3Likes={getWeb3Dislikes(postInfo)}
        />
      </FlexBox>
    </ErrorBoundary>
  );
}

VoteComp.propTypes = {
  account: PropTypes.object,
  url: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  weights: PropTypes.object.isRequired,
  levels: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  postType: PropTypes.string,
  postInfo: PropTypes.object.isRequired,
  ethAuth: PropTypes.object,
  categories: PropTypes.array
};

VoteComp.defaultProps = {
  weights: {
    overall: null
  },
  voterWeight: 0
};

export default VoteComp;
