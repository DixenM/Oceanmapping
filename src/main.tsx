import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './styles/index.css'
import 'leaflet/dist/leaflet.css'

/**
 * TanStack Query configuration
 * 
 * Purpose: Configure global caching and data fetching behavior
 * - staleTime: 5 minutes - data is fresh for 5 minutes
 * - cacheTime: 10 minutes - cached data kept for 10 minutes
 * - refetchOnWindowFocus: false - don't refetch when window regains focus
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      refetchOnWindowFocus: false,
      retry: 2, // Retry failed requests twice
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
