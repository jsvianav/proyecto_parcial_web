import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const GENRES = [
  { id: 'pop',        label: 'Pop',        gradient: 'linear-gradient(135deg,oklch(0.52 0.20 0),oklch(0.38 0.18 350))',   q: 'pop' },
  { id: 'rock',       label: 'Rock',       gradient: 'linear-gradient(135deg,oklch(0.46 0.19 25),oklch(0.30 0.15 20))',   q: 'rock' },
  { id: 'hiphop',     label: 'Hip-Hop',    gradient: 'linear-gradient(135deg,oklch(0.56 0.15 80),oklch(0.38 0.12 70))',   q: 'hip hop' },
  { id: 'electronic', label: 'Electronic', gradient: 'linear-gradient(135deg,oklch(0.46 0.20 250),oklch(0.30 0.15 265))', q: 'electronic' },
  { id: 'jazz',       label: 'Jazz',       gradient: 'linear-gradient(135deg,oklch(0.54 0.14 55),oklch(0.38 0.11 50))',   q: 'jazz' },
  { id: 'reggaeton',  label: 'Reggaetón',  gradient: 'linear-gradient(135deg,oklch(0.44 0.17 310),oklch(0.28 0.14 290))', q: 'reggaeton' },
]

export default function GenreCard({ genre }) {
  const navigate = useNavigate()
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/search?q=${encodeURIComponent(genre.q)}`)}
      style={{
        background: genre.gradient, borderRadius: 12, height: 96, cursor: 'pointer',
        display: 'flex', alignItems: 'flex-end', padding: '12px 14px',
        position: 'relative', overflow: 'hidden',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hov ? '0 8px 28px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        position: 'absolute', top: -14, right: -14, width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <span style={{
        fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em',
        position: 'relative', zIndex: 1, textShadow: '0 1px 8px rgba(0,0,0,0.4)',
      }}>{genre.label}</span>
    </div>
  )
}
