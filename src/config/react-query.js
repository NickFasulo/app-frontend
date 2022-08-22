// Create react-query client
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
      staleTime: 300000
    }
  }
});
