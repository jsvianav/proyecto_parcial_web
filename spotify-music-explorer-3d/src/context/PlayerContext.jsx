import { createContext, useContext, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(track) {
    if (!track.preview_url) return

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = track.preview_url
      audioRef.current.play()
    }

    setCurrentTrack(track)
    setIsPlaying(true)
  }

  function pause() {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, play, pause, stop }}>
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
