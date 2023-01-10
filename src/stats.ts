import Stats from 'stats.js'

export const stats = new Stats()

stats.showPanel(0)
stats.dom.style.left = 'auto'
stats.dom.style.top = 'auto'
stats.dom.style.right = '0'
stats.dom.style.bottom = '0'
stats.dom.style.display = 'none'
document.body.appendChild(stats.dom)

export function toggleStats(e: KeyboardEvent) {
  if (e.key == 'h')
    stats.dom.style.display = stats.dom.style.display == 'none' ? '' : 'none'
}
