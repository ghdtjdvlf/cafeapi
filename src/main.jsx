import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'antd/dist/reset.css'
import './index.css'


// --- 1. React Query에서 필요한 것들을 import 합니다. ---
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// --- 2. "본부" (QueryClient) 인스턴스를 생성합니다. ---
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- 3. <App />을 Provider로 감싸줍니다. --- */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)