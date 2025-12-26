import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import App from './App.tsx'
import Article from './components/Article.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
    </BrowserRouter>
)
