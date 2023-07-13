import { QueryClient } from '@tanstack/react-query'
import { toast } from '@ui/toast'

function QueryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const description =
    // eslint-disable-next-line react/destructuring-assignment
    error instanceof Error ? error.message : 'error connecting to server'

  // prevent duplicate toasts

  // show toast when there is error in queries and mutations
  toast({
    variant: 'destructive',
    title: 'Error Message',
    description,
  })
}

// to satisfy typescript until this file has uncommented contents
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: QueryErrorHandler,
      staleTime: 600000, // 10min
      cacheTime: 900000, // 15 minutes
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: QueryErrorHandler,
    },
  },
})

export { queryClient }
