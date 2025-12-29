import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import App from './App.tsx'
import Article from './components/Article.tsx'
import './index.css'

// Handle GitHub Pages 404 redirect
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  // Remove the redirect parameter and navigate to the actual path
  window.history.replaceState(null, '', redirect);
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
    </BrowserRouter>
)
