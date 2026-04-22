import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function SearchBar({ initialValue = '', autoFocus = false, onSearch, value: controlledValue, onChange }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(initialValue)
  const [, setRecents] = useLocalStorage('spotify_recent_searches', [])

  const value  = isControlled ? controlledValue : internalValue
  const handle = isControlled ? onChange : setInternalValue

  useEffect(() => {
    if (!isControlled) setInternalValue(initialValue)
  }, [initialValue, isControlled])

  useEffect(() => {
    if (autoFocus) setTimeout(() => ref.current?.focus(), 80)
  }, [autoFocus])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setRecents(prev => [trimmed, ...prev.filter(r => r !== trimmed)].slice(0, 6))
    if (onSearch) onSearch(trimmed)
    else navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)', pointerEvents: 'none', zIndex: 1,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input
        ref={ref}
        value={value}
        onChange={e => handle(e.target.value)}
        placeholder="Buscar artistas, álbumes, canciones…"
        style={{
          width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 13, paddingLeft: 46, paddingRight: value ? 110 : 16, paddingTop: 13, paddingBottom: 13,
          fontSize: 15, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(29,185,84,0.11)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none' }}
      />
      {value && (
        <button type="submit" style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          background: 'var(--accent)', border: 'none', borderRadius: 9, padding: '6px 14px',
          fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer', transition: 'filter 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'none'}
        >Buscar</button>
      )}
    </form>
  )
}
