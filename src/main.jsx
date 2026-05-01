import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ─── Google Analytics ───────────────────────────────────────────────────────
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
if (gaId) {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', gaId)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
