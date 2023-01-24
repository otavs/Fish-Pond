import Stats from 'stats.js'
import { params } from './params'

export const stats = new Stats()

export function initStats() {
  stats.showPanel(0)
  stats.dom.style.left = 'auto'
  stats.dom.style.top = 'auto'
  stats.dom.style.right = '0'
  stats.dom.style.bottom = '0'
  setVisible(params.stats)
  document.body.appendChild(stats.dom)
}

export function toggleStats(e: KeyboardEvent) {
  if (e.key == 'h') setVisible(stats.dom.style.display == 'none')
}

export function setVisible(visible: boolean) {
  stats.dom.style.display = visible ? '' : 'none'
}

export function isVisible() {
  return stats.dom.style.display == ''
}

export default { stats, setVisible, isVisible }
