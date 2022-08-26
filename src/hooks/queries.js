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
      url: `/collections/name-v2/${id}`,
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
    async () => {
      if (!postid || !voter) return [];
      try {
        return await callYupApi({
          url: `/votes/post/${postid}/voter/${voter}`,
          method: 'GET'
        });
      } catch {
        return [];
      }
    }
  );
  return data;
};

export const useFollowings = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWING, id], () =>
    callYupApi({
      method: 'GET',
      url: `/following/${id}`
    })
  );

  return data;
};

export const useFollowers = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWER, id], () =>
    callYupApi({
      method: 'GET',
      url: `/v2/followers/${id}`
    })
  );

  return data;
};

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

      return (
        (await callYupApi({
          method: 'GET',
          url: `/accounts/${userId}/collections`
        })) || []
      );
    }
  );

  return data;
};

export const useUserNotifications = (username) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.USER_NOTIFICATIONS, username],
    () => {
      if (!username) return [];

      return callYupApi({
        method: 'GET',
        url: `/notifications/${username}`
      });
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
export const useFetchFeed = ({ feedType }) =>
  useInfiniteQuery(
    [REACT_QUERY_KEYS.YUP_FEED, feedType],
    ({ pageParam = 0 }) =>
      callYupApi({
        url: `/feed/${
          isStaging && feedType !== FEED_CATEGORIES.RECENT.id ? 'staging:' : ''
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
  const { data } = useQuery([REACT_QUERY_KEYS.POST, id], () => {
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
  const { data } = useQuery([REACT_QUERY_KEYS.ACCOUNT, userId], () =>
    callYupApi({
      url: `/accounts/${userId}`
    })
  );

  return data;
};

export const useRefetchPostPreview = (post, id) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.POST_REFETCH_PREVIEW, id],
    async () => {
      if (
        Number(post.previewData.lastUpdated) + 3 * 60 * 60 * 1000 >
        Date.now()
      )
        return null;

      return callYupApi({
        url: '/posts/re-fetch/preview',
        method: 'POST',
        data: { postid: id }
      });
    }
  );

  return data;
};

export const usePostInteractions = (postid) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_POSTINTERACTIONS, postid],
    async () => {
      if (!postid) return [];
      try {
        return await callYupApi({
          url: `/posts/interactions/${postid}`,
          method: 'POST'
        });
      } catch {
        return [];
      }
    }
  );
  return data;
};

export const useLpRewards = (address) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.LP_REWARDS, address],
    async () => {
      if (!address) return null;
      try {
        return await callYupApi({
          url: `/metrics/historic-lp-rewards/${address}`,
          method: 'GET'
        });
      } catch {
        return null;
      }
    }
  );
  return data;
};

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

export const useWalletInfo = (ethAddress) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.WALLET_INFO, ethAddress],
    () => {
      return {
        tokens: [
          {
            image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
            name: 'USDC',
            chain: 'ETHEREUM',
            balance: 20000,
            balanceUSD: 20000
          },
          {
            image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
            name: 'USDC',
            chain: 'ETHEREUM',
            balance: 20000,
            balanceUSD: 20000
          },
          {
            image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
            name: 'USDC',
            chain: 'POLYGON',
            chainImage: 'https://content-api.changenow.io/uploads/matic_token_f9906e3f5d.svg',
            balance: 20000,
            balanceUSD: 20000
          },
          {
            image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
            name: 'USDC',
            chain: 'ETHEREUM',
            balance: 20000,
            balanceUSD: 20000
          },
          {
            image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
            name: 'USDC',
            chain: 'ETHEREUM',
            balance: 20000,
            balanceUSD: 20000
          }
        ],
        nfts: [
          {
            image: 'https://lh3.googleusercontent.com/POAbbOJdmt2JwLpROZWATiZ01rBTK5ozE52X74rQaW_cAR_xRLhKbyUhjrIoo_1XCMpT0wF-G1k_pVHXvBTEBs18xm6GGDHGujdDsQ=w600',
            collectionName: 'Super Saiyan Army Super Saiyan Army Super Saiyan Army Super Saiyan Army',
            collectionImage: 'https://openseauserdata.com/files/fe5d7e2582dc8a6155244f2bd2d06793.gif',
            verified: true,
            link: ''
          },
          {
            image: 'https://lh3.googleusercontent.com/giA81_dV__ihKWNW5xiZ4KOGvs4aQhYgOG9uOM5z_3kv6cAM_Vjl96OVbZxZJR1jNLmTPeDrhyR4-WuOZO_SJG8g2E2qUq73ckg9Qg=w600',
            collectionName: 'Super Saiyan Army',
            collectionImage: 'https://openseauserdata.com/files/fe5d7e2582dc8a6155244f2bd2d06793.gif',
            verified: false,
            link: ''
          },
          {
            image: 'https://lh3.googleusercontent.com/POAbbOJdmt2JwLpROZWATiZ01rBTK5ozE52X74rQaW_cAR_xRLhKbyUhjrIoo_1XCMpT0wF-G1k_pVHXvBTEBs18xm6GGDHGujdDsQ=w600',
            collectionName: 'Super Saiyan Army',
            collectionImage: 'https://openseauserdata.com/files/fe5d7e2582dc8a6155244f2bd2d06793.gif',
            verified: true,
            link: ''
          }
        ],
        poaps: [
          {
            image: 'https://assets.poap.xyz/athens-200-beta-turkey-day-launch-party-2021-logo-1637812918593.png',
            description: 'A big',
            link: 'https://poap.gallery/event/8251'
          },
          {
            image: 'https://assets.poap.xyz/edens-first-100-supporters-2021-logo-1632300557098.png',
            description: 'A big special thanks to you for being one of our early supporters and celebrating the launch of Athens 2.0.0-beta with us! Unfortunately we couldn\'t split a turkey over the internet, so we made this turkey JPEG for you instead.\n',
            link: 'https://poap.gallery/event/8251'
          },
          {
            image: 'https://assets.poap.xyz/athens-200-beta-turkey-day-launch-party-2021-logo-1637812918593.png',
            description: 'A big special thanks to you for being one of our early supporters and celebrating the launch of Athens 2.0.0-beta with us! Unfortunately we couldn\'t split a turkey over the internet, so we made this turkey JPEG for you instead.\n',
            link: 'https://poap.gallery/event/8251'
          },
          {
            image: 'https://assets.poap.xyz/athens-200-beta-turkey-day-launch-party-2021-logo-1637812918593.png',
            description: 'A big special thanks to you for being one of our early supporters and celebrating the launch of Athens 2.0.0-beta with us! Unfortunately we couldn\'t split a turkey over the internet, so we made this turkey JPEG for you instead.\n',
            link: 'https://poap.gallery/event/8251'
          }
        ]
      };
    }
  );

  return data;
};
