import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { PlayerProvider } from './context/PlayerContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <PlayerProvider>
          <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] font-sans text-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/artist/:id" element={<DetailPage type="artist" />} />
                <Route path="/album/:id" element={<DetailPage type="album" />} />
                <Route path="/track/:id" element={<DetailPage type="track" />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PlayerProvider>
      </FavoritesProvider>
    </BrowserRouter>
  )
}
