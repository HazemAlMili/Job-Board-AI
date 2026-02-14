import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `<div style="padding: 50px; color: red; font-size: 20px;">
    <h1>Error loading application</h1>
    <p>Check the console for details (Press F12)</p>
    <pre>${error}</pre>
  </div>`;
}


