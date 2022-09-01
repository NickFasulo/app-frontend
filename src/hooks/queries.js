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

export const useCollection = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.YUP_COLLECTION, id], () =>
    callYupApi({
      url: `/collections/name/${id}`,
      method: 'GET'
    })
  );
  return data;
};

export const useRecommendation = (params) => {
  const { name, description, id, limit } = params;
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_COLLECTION, id, name, description, limit],
    () =>
      callYupApi({
        url: '/collections/recommended',
        method: 'GET',
        params
      })
  );
  return data;
};

export const useInitialVotes = (postid, voter) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_INITIAL_VOTES, postid, voter],
    () =>
      callYupApi({
        url: `/votes/post/${postid}/voter/${voter}`,
        method: 'GET'
      })
  );
  return data;
};

export const useSocialLevel = (voter) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_SOCIAL_LEVEL, voter],
    async () => {
      if (!voter) return null;

      try {
        return await callYupApi({
          url: `/levels/user/${voter}`,
          method: 'GET'
        });
      } catch {
        return null;
      }
    }
  );

  return data;
};

export const useFollowings = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWING, id], async () => {
    try {
      return await callYupApi({
        method: 'GET',
        url: `/following/${id}`
      });
    } catch {
      return [];
    }
  });

  return data;
};

export const useFollowers = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWER, id], async () => {
    try {
      return await callYupApi({
        method: 'GET',
        url: `/v2/followers/${id}`
      });
    } catch {
      return [];
    }
  });

  return data;
};

export const useUserPosts = (userId) => useInfiniteQuery(
  [REACT_QUERY_KEYS.USER_POSTS, userId],
  ({ pageParam = 0 }) => callYupApi({
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

export const useSearchPosts = (query) => {
  const searchQuery = query
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/[^a-zA-Z'@ ]/g, '');

  return useInfiniteQuery(
    [REACT_QUERY_KEYS.SEARCH_POSTS, query],
    ({ pageParam = 0 }) => callYupApi({
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

export const useSearchPeople = (query, limit) => {
  const { data } = useQuery([REACT_QUERY_KEYS.SEARCH_PEOPLE, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/users',
      params: {
        searchText: query,
        limit: limit || DEFAULT_SEARCH_SIZE
      }
    })
  );

  return data;
};

export const useSearchCollections = (query) => {
  const { data } = useQuery([REACT_QUERY_KEYS.SEARCH_COLLECTIONS, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/collections',
      params: {
        searchText: query,
        limit: DEFAULT_SEARCH_SIZE
      }
    })
  );

  return data;
};

export const useUserCollections = (userId) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.USER_COLLECTIONS, userId],
    async () => {
      if (!userId) return [];

      try {
        return await callYupApi({
          method: 'GET',
          url: `/accounts/${userId}/collections`
        });
      } catch {
        return [];
      }
    }
  );

  return data;
};

export const useUserNotifications = (username) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.USER_NOTIFICATIONS, username],
    async () => {
      if (!username) return [];

      try {
        return await callYupApi({
          method: 'GET',
          url: `/notifications/${username}`
        });
      } catch {
        return null;
      }
    }
  );

  return data;
};

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

export const useUserLikes = (userId) => {
  const { data } = useQuery([REACT_QUERY_KEYS.USER_LIKES, userId], async () => {
    const res = await callYupApi({
      url: `/feed/account/${userId}`
    });

    return res.totalCount;
  });

  return data;
};
export const useFetchFeed = ({ feedType }) => useInfiniteQuery(
  [REACT_QUERY_KEYS.YUP_FEED, feedType],
  ({ pageParam = 0 }) =>
    callYupApi({
      url: `/feed/${isStaging && feedType !== FEED_CATEGORIES.RECENT.id ? 'staging:' : ''
        }${feedType}?start=${pageParam}&limit=10`,
      method: 'GET'
    }),
  {
    refetchOnWindowFocus: false,
    getPreviousPageParam: (firstPage, pages) =>
      pages.length > 0 && pages.length - 1 * 10,
    getNextPageParam: (lastPage, pages) => pages.length * 10
  }
);

export const usePost = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.POST, id], async () => {
    if (!id) return null;

    return callYupApi({
      url: `/posts/post/${id}`
    });
  });

  return data;
};

export const useScore = (address) => {
  const { data } = useQuery([REACT_QUERY_KEYS.SCORE, address], async () => {
    if (!address) return null;
    return callYupApi({
      url: `/score?address=${address}`
    });
  });

  return data;
};

export const useYupAccount = (userId) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.ACCOUNT, userId],
    async () => {
      try {
        return await callYupApi({
          url: `/accounts/${userId}`
        });
      } catch {
        return null;
      }
    }
  );

  return data;
}
