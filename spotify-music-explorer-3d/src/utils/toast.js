export function showToast(msg, type = 'default') {
  const root = document.getElementById('toast-root')
  if (!root) return
  const el = document.createElement('div')
  el.className = 'toast'
  const colors = { success: 'var(--accent)', error: '#EF4444', info: '#60a5fa', default: 'var(--text-tertiary)' }
  const dot = colors[type] || colors.default
  el.innerHTML = `<div class="toast-dot" style="background:${dot}"></div><span>${msg}</span>`
  root.appendChild(el)
  setTimeout(() => {
    el.style.cssText += 'opacity:0;transform:translateX(16px);transition:all 0.25s;'
    setTimeout(() => el.remove(), 280)
  }, 2600)
}
