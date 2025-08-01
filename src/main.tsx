import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import AppWithAuth from './AppWithAuth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  </StrictMode>,
)
