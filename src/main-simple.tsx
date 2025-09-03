import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Fortune App</h2>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Application is starting up...
        </p>
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <p>✅ React is working</p>
          <p>✅ Vite is serving the app</p>
          <p>✅ Basic styling is loaded</p>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<SimpleApp />)