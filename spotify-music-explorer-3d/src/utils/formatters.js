export function formatNumber(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export function formatDuration(ms) {
  if (!ms) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function getImageUrl(images, size = 'medium') {
  if (!images || images.length === 0) return null
  if (size === 'large') return images[0]?.url
  if (size === 'small') return images[images.length - 1]?.url
  return images[Math.floor(images.length / 2)]?.url || images[0]?.url
}

export function truncate(str, max = 40) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}
