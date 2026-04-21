import { useState, useEffect } from 'react'
import { searchSpotify } from '../services/spotifyAPI'

export function useSpotifySearch(query, type = 'all', offset = 0) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.trim() === '') {
      setData(null)
      setError(null)
      return
    }

    const types =
      type === 'all' ? ['artist', 'album', 'track'] : [type]

    let cancelled = false
    setLoading(true)
    setError(null)

    searchSpotify(query, types, offset)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, type, offset])

  return { data, loading, error }
}
