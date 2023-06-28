import { QueryClient } from '@tanstack/react-query'

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server'

  // prevent duplicate toasts

  // @TODO: Implement global error handler with a toast
  console.log(title)
}

// to satisfy typescript until this file has uncommented contents
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 600000, // 10min
      cacheTime: 900000, // 15 minutes
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
})

export { queryClient }
