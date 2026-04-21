import { useState, useCallback } from 'react'
import { getAccessToken } from '../services/spotifyAPI'

export function useSpotifyAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchToken = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getAccessToken()
      return token
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchToken, loading, error }
}
