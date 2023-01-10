import { toggleStats } from './stats'

export const mouse = {
  x: 0,
  y: 0,
}

export function registerEvents(canvas: HTMLCanvasElement) {
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
  })

  canvas.addEventListener('keydown', toggleStats)
}
