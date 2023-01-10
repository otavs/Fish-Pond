import { toggleStats } from './stats'
import Vector from './vector'

export const mouse = new Vector(0, 0)

export function registerEvents(canvas: HTMLCanvasElement) {
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
  })

  document.addEventListener('keydown', toggleStats)
}
