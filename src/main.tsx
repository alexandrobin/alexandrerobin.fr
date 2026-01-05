import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import { HelmetProvider } from 'react-helmet-async'
import { lazy, Suspense } from 'react'
import App from './App.tsx'
import './index.css'

// Lazy load Article component to reduce initial bundle size
const Article = lazy(() => import('./components/Article.tsx'))

// Handle GitHub Pages 404 redirect
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  // Remove the redirect parameter and navigate to the actual path
  window.history.replaceState(null, '', redirect);
}

createRoot(document.getElementById('root')!).render(
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/article/:slug" element={
            <Suspense fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Loading article...</div>}>
              <Article />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
)
