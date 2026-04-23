import axios from 'axios'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

const TOKEN_URL = import.meta.env.DEV
  ? '/spotify-token'
  : 'https://accounts.spotify.com/api/token'

let tokenCache = {
  token: null,
  expiresAt: 0,
}

export async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }

  if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === 'tu_client_id_aqui') {
    throw new Error(
      'Credenciales de Spotify no configuradas. Crea un archivo .env con VITE_SPOTIFY_CLIENT_ID y VITE_SPOTIFY_CLIENT_SECRET.'
    )
  }

  try {
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    const body = new URLSearchParams()
    body.append('grant_type', 'client_credentials')

    const response = await axios.post(TOKEN_URL, body, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    tokenCache.token = response.data.access_token
    tokenCache.expiresAt = Date.now() + (response.data.expires_in - 60) * 1000
    return tokenCache.token
  } catch (err) {
    const detail =
      err.response?.data?.error_description ||
      err.response?.data?.error ||
      err.message
    throw new Error(`No se pudo obtener el token de Spotify: ${detail}`)
  }
}

// Use fetch instead of Axios for GET requests.
// Axios 1.x serializes params with URLSearchParams which encodes commas as %2C,
// breaking Spotify's multi-value type parameter (type=artist,album,track).
async function spotifyFetch(url) {
  let token = await getAccessToken()

  const doFetch = async (t) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${t}` },
    })

    if (res.status === 401) return null // signal retry

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(
        data?.error?.message || `Error ${res.status} en la petición a Spotify`
      )
    }

    return res.json()
  }

  let result = await doFetch(token)

  if (result === null) {
    // Token expired mid-session — renew once and retry
    tokenCache.token = null
    token = await getAccessToken()
    result = await doFetch(token)
    if (result === null) throw new Error('No autorizado por Spotify')
  }

  return result
}

// Build a query string manually so commas in values are NOT percent-encoded.
function buildUrl(base, params) {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v)).replace(/%2C/gi, ',')}`)
  return parts.length ? `${base}?${parts.join('&')}` : base
}

export async function searchSpotify(
  query,
  types = ['artist', 'album', 'track'],
  offset = 0
) {
  const url = buildUrl('https://api.spotify.com/v1/search', {
    q: query,
    type: types.join(','),
    limit: 10,
    offset: Math.floor(Number(offset)) || 0,
  })
  return spotifyFetch(url)
}

export async function getArtist(id) {
  return spotifyFetch(`https://api.spotify.com/v1/artists/${id}`)
}

export async function getArtistTopTracks(id) {
  return spotifyFetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`
  )
}

export async function getArtistAlbums(id) {
  return spotifyFetch(
    `https://api.spotify.com/v1/artists/${id}/albums?market=US&include_groups=album,single&limit=10`
  )
}

export async function getAlbum(id) {
  return spotifyFetch(`https://api.spotify.com/v1/albums/${id}`)
}

export async function getTrack(id) {
  return spotifyFetch(`https://api.spotify.com/v1/tracks/${id}`)
}
