import { feedConstants as constants } from '../constants';
import axios from 'axios';
import rollbar from '../../utils/rollbar';
import { apiBaseUrl } from '../../config';

export function setHomeFeed(feed) {
  return { type: constants.SET_HOME_FEED, feed };
}

export async function fetchNftFeed(start, limit) {
  return (
    await axios.get(`${apiBaseUrl}/feed/nfts?start=${start}&limit=${limit}`)
  ).data;
}

export async function fetchMirrorFeed(start, limit) {
  return (
    await axios.get(`${apiBaseUrl}/feed/mirror?start=${start}&limit=${limit}`)
  ).data;
}

export async function fetchCryptoFeed(start, limit) {
  return (
    await axios.get(`${apiBaseUrl}/feed/crypto/?start=${start}&limit=${limit}`)
  ).data;
}

export async function fetchCategoryFeed(feedType, start, limit) {
  let category;
  switch (feedType) {
    case 'latenightcool':
      category = 'popularity';
      break;
    default:
      category = 'popularity';
      break;
  }
  return (
    await axios.get(
      `${apiBaseUrl}/feed/category/${category}?start=${start}&limit=${limit}`
    )
  ).data;
}

export async function fetchHomeFeed(start, limit) {
  return (
    await axios.get(
      `${apiBaseUrl}/feed/id/staging:dailyhits?start=${start}&limit=${limit}`
    )
  ).data;
}

export async function fetchRecentFeed(start, limit) {
  return (
    await axios.get(`${apiBaseUrl}/feed/recent?start=${start}&limit=${limit}`)
  ).data;
}

export async function fetchPoliticsFeed(start, limit) {
  return (
    await axios.get(
      `${apiBaseUrl}/feed/politics/?start=${start}&limit=${limit}`
    )
  ).data;
}

export async function fetchSafeFeed(start, limit) {
  return (
    await axios.get(
      `${apiBaseUrl}/feed/safespace?start=${start}&limit=${limit}`
    )
  ).data;
}

export async function fetchFarcasterFeed(start, limit) {
  return (
    await axios.get(
      `${apiBaseUrl}/feed/farcaster?start=${start}&limit=${limit}`
    )
  ).data;
}

export async function fetchLensFeed(start, limit) {
  return (
    await axios.get(`${apiBaseUrl}/feed/lens?start=${start}&limit=${limit}`)
  ).data;
}

export function fetchFeed(feedType, start, limit) {
  return async (dispatch) => {
    dispatch(request(feedType));
    try {
      let res;
      if (feedType === 'nfts') {
        res = await fetchNftFeed(start, limit);
      } else if (feedType === 'crypto') {
        res = await fetchCryptoFeed(start, limit);
      } else if (feedType === 'dailyhits') {
        res = await fetchHomeFeed(start, limit);
      } else if (feedType === 'recent') {
        res = await fetchRecentFeed(start, limit);
      } else if (feedType === 'mirror') {
        res = await fetchMirrorFeed(start, limit);
      } else if (feedType === 'politics') {
        res = await fetchPoliticsFeed(start, limit);
      } else if (feedType === 'safespace') {
        res = await fetchSafeFeed(start, limit);
      } else if (feedType === 'farcaster') {
        res = await fetchFarcasterFeed(start, limit);
      } else if (feedType === 'lens') {
        res = await fetchLensFeed(start, limit);
      } else {
        res = await fetchCategoryFeed(feedType, start, limit);
      }
      dispatch(success(feedType, res, start, limit));
    } catch (err) {
      rollbar.error(`WEBAPP: Failed to load feed error=${JSON.stringify(err)}`);
      console.error('Failed to fetch recent feed posts', err);
      dispatch(failure(feedType, err));
    }
  };

  function request(feedType, start, limit) {
    return { type: constants.FETCH_FEED, feedType };
  }

  function success(feedType, posts, newStart, newLimit) {
    return {
      type: constants.FETCH_FEED_SUCCESS,
      feedType,
      posts,
      newStart,
      newLimit
    };
  }

  function failure(feedType, error) {
    return { type: constants.FETCH_FEED_FAILURE, feedType, error };
  }
}
