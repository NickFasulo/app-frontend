// Create react-query client
import { QueryClient } from '@tanstack/react-query';
import { MUTATION_KEYS, REACT_QUERY_KEYS } from '../constants/enum';
import { apiFollowUser, apiUnfollowUser } from '../apis';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
      staleTime: 300000
    }
  }
});

queryClient.setMutationDefaults( [MUTATION_KEYS.FOLLOW_UNFOLLOW_USER], {
  mutationFn: async ({ isFollow, authUserId, followUnfollowUserId, authInfo }) => {
    if (isFollow) {
      return await apiFollowUser(authUserId, followUnfollowUserId, authInfo);
    } else {
      return await apiUnfollowUser(authUserId, followUnfollowUserId, authInfo);
    }
  },
  onSuccess: (_, { isFollow, authUserId, followUnfollowUserId }) => {
    queryClient.setQueryData(
      [REACT_QUERY_KEYS.FOLLOWING, authUserId],
      (old) => {
        if (!old) return old;

        if (isFollow) {
          return [...old, followUnfollowUserId];
        } else {
          return old.filter((userId) => userId !== followUnfollowUserId);
        }
      }
    );
  }
});
