import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import sum from 'lodash/sum';
import { REACT_QUERY_KEYS } from '../constants/enum';
import callYupApi from '../apis/base_api';
import {
  DEFAULT_FEED_PAGE_SIZE,
  DEFAULT_SEARCH_SIZE,
  isStaging
} from '../config';
import { FEED_CATEGORIES } from '../constants/data';

export const useCollection = (id) =>
  useQuery([REACT_QUERY_KEYS.YUP_COLLECTION, id], () =>
    callYupApi({
      url: `/collections/name-v2/${id}`,
      method: 'GET'
    })
  );

export const useRecommendation = (params) => {
  const { name, description, id } = params;
  return useQuery(
    [REACT_QUERY_KEYS.RECOMMENDED_COLLECTIONS, id, name, description],
    () =>
      callYupApi({
        url: '/collections/recommended',
        method: 'GET',
        params
      })
  );
};

export const useInitialVotes = (postid, voter) =>
  useQuery(
    [REACT_QUERY_KEYS.YUP_INITIAL_VOTES, postid, voter],
    () =>
      callYupApi({
        url: `/votes/post/${postid}/voter/${voter}`,
        method: 'GET'
      }),
    {
      enabled: Boolean(postid && voter)
    }
  );

export const useFollowings = (id) =>
  useQuery(
    [REACT_QUERY_KEYS.FOLLOWING, id],
    () =>
      callYupApi({
        method: 'GET',
        url: `/following/${id}`
      }),
    {
      enabled: !!id
    }
  );

export const useFollowers = (id) =>
  useQuery(
    [REACT_QUERY_KEYS.FOLLOWER, id],
    () =>
      callYupApi({
        method: 'GET',
        url: `/v2/followers/${id}`
      }),
    {
      enabled: !!id
    }
  );

export const useUserPosts = (userId) =>
  useInfiniteQuery(
    [REACT_QUERY_KEYS.USER_POSTS, userId],
    ({ pageParam = 0 }) =>
      callYupApi({
        method: 'GET',
        url: `/feed/account/${userId}`,
        params: {
          start: pageParam,
          limit: DEFAULT_FEED_PAGE_SIZE
        }
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.posts?.length) return undefined;

        return sum(allPages.map((page) => page.posts?.length || 0));
      }
    }
  );

export const useSearchPosts = (query = '') => {
  const searchQuery = query
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/[^a-zA-Z'@ ]/g, '');

  return useInfiniteQuery(
    [REACT_QUERY_KEYS.SEARCH_POSTS, query],
    ({ pageParam = 0 }) =>
      callYupApi({
        method: 'GET',
        url: '/search/es/posts',
        params: {
          offset: pageParam,
          searchText: searchQuery,
          limit: DEFAULT_FEED_PAGE_SIZE
        }
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.length) return undefined;

        return sum(allPages.map((page) => page.length || 0));
      }
    }
  );
};

export const useSearchPeople = (query, limit) =>
  useQuery([REACT_QUERY_KEYS.SEARCH_PEOPLE, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/users',
      params: {
        searchText: query,
        limit: limit || DEFAULT_SEARCH_SIZE
      }
    })
  );

export const useSearchCollections = (query) =>
  useQuery([REACT_QUERY_KEYS.SEARCH_COLLECTIONS, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/collections',
      params: {
        searchText: query,
        limit: DEFAULT_SEARCH_SIZE
      }
    })
  );

export const useUserCollections = (userId) =>
  useQuery(
    [REACT_QUERY_KEYS.USER_COLLECTIONS, userId],
    () =>
      callYupApi({
        method: 'GET',
        url: `/accounts/${userId}/collections`
      }),
    {
      enabled: !!userId
    }
  );

export const useUserNotifications = (username) =>
  useQuery(
    [REACT_QUERY_KEYS.USER_NOTIFICATIONS, username],
    () =>
      callYupApi({
        method: 'GET',
        url: `/notifications/${username}`
      }),
    {
      enabled: !!username
    }
  );

export const useFarcasterReplyParent = (merkleRoot) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.FARCASTER_PARENT, merkleRoot],
    () =>
      fetch(
        `https://api.farcaster.xyz/indexer/threads/${merkleRoot}?viewer_address=0xB9f95cee37ED663C088a5B772FAe772DaEf6b130&include_deleted_casts=true&version=2`
      )

    // return callYupApi({
    //   method: 'GET',
    //   url: `/notifications/${username}`
    // });
  );

  return data;
};

export const useUserLikes = (userId) =>
  useQuery(
    [REACT_QUERY_KEYS.USER_LIKES, userId],
    async () => {
      const res = await callYupApi({
        url: `/feed/account/${userId}`
      });

      return res.totalCount;
    },
    {
      enabled: !!userId
    }
  );

export const useFetchFeed = ({ feedType, accountId }) =>
  useInfiniteQuery(
    [REACT_QUERY_KEYS.YUP_FEED, feedType, accountId],
    ({ pageParam = 0 }) =>
      callYupApi({
        url: `/feed/${isStaging && feedType !== FEED_CATEGORIES.RECENT.id ? 'staging:' : ''
          }${feedType}?start=${pageParam}&limit=10&account=${accountId}`,
        method: 'GET'
      }),
    {
      refetchOnWindowFocus: false,
      getPreviousPageParam: (firstPage, pages) =>
        pages.length > 0 && pages.length - 1 * 10,
      getNextPageParam: (lastPage, pages) => pages.length * 10
    }
  );

export const usePost = (id) =>
  useQuery(
    [REACT_QUERY_KEYS.POST, id],
    () =>
      callYupApi({
        url: `/posts/post/${id}`
      }),
    {
      enabled: !!id
    }
  );

export const useScore = (address) =>
  useQuery(
    [REACT_QUERY_KEYS.SCORE, address],
    () =>
      callYupApi({
        url: `/score?address=${address}`
      }),
    {
      enabled: !!address
    }
  );

export const useYupAccount = (userId) =>
  useQuery(
    [REACT_QUERY_KEYS.ACCOUNT, userId],
    () =>
      callYupApi({
        url: `/accounts/${userId}`
      }),
    {
      enabled: !!userId
    }
  );

export const useRefetchPostPreview = (post, id) =>
  useQuery([REACT_QUERY_KEYS.POST_REFETCH_PREVIEW, id], () => {
    if (Number(post.previewData.lastUpdated) + 3 * 60 * 60 * 1000 > Date.now())
      return null;

    return callYupApi({
      url: '/posts/re-fetch/preview',
      method: 'POST',
      data: { postid: id }
    });
  });

export const usePostInteractions = (postid) =>
  useQuery(
    [REACT_QUERY_KEYS.YUP_POSTINTERACTIONS, postid],
    () =>
      callYupApi({
        url: `/posts/interactions/${postid}`,
        method: 'POST'
      }),
    {
      enabled: !!postid
    }
  );

export const useLpRewards = (address) =>
  useQuery(
    [REACT_QUERY_KEYS.LP_REWARDS, address],
    () =>
      callYupApi({
        url: `/metrics/historic-lp-rewards/${address}`,
        method: 'GET'
      }),
    {
      enabled: !!address
    }
  );

export const useCollectionPosts = (id) =>
  useInfiniteQuery(
    [REACT_QUERY_KEYS.COLLECTION_POSTS, id],
    ({ pageParam = 0 }) =>
      callYupApi({
        url: `/collections/posts/${id}`,
        params: {
          start: pageParam,
          limit: DEFAULT_FEED_PAGE_SIZE
        }
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if ((lastPage?.length || 0) < DEFAULT_FEED_PAGE_SIZE) return undefined;

        return sum(pages.map((page) => page.length || 0));
      }
    }
  );

export const useWalletInfo = (ethAddress) =>
  useQuery(
    [REACT_QUERY_KEYS.WALLET_INFO, ethAddress],
    () =>
      callYupApi({
        url: `/profile/${ethAddress}`
      }),
    {
      enabled: !!ethAddress
    }
  );

export const useHomeConfig = () => {
  const { data } = useQuery([REACT_QUERY_KEYS.HOME_CONFIG], () =>
    callYupApi({
      url: `/home-config/v2`
    })
  );

  return data;
};
