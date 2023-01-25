import { toggleStats } from './stats'
import Vector from './vector'

export const mouse = {
  pos: new Vector(0, 0),
  pressed: false,
  leftPressed: false,
  midPressed: false,
  rightPressed: false,
}

export function registerEvents(canvas: HTMLCanvasElement) {
  canvas.addEventListener('mousemove', (e) => {
    mouse.pos.x = e.x
    mouse.pos.y = e.y
  })

  canvas.onmousemove = (e) => {
    mouse.pos.x = e.x
    mouse.pos.y = e.y
  }

  canvas.onmousedown = (e) => {
    mouse.pressed = true
    switch (e.button) {
      case 0:
        mouse.leftPressed = true
        break
      case 1:
        mouse.midPressed = true
        break
      case 2:
        mouse.rightPressed = true
        break
    }
  }

  canvas.onmouseup = (e) => {
    mouse.pressed = false
    switch (e.button) {
      case 0:
        mouse.leftPressed = false
        break
      case 1:
        mouse.midPressed = false
        break
      case 2:
        mouse.rightPressed = false
        break
    }
  }

  canvas.oncontextmenu = () => false

  canvas.ontouchstart = (e) => {
    mouse.pressed = true
    mouse.leftPressed = true
    mouse.pos.x = e.touches[0].clientX
    mouse.pos.y = e.touches[0].clientY
  }

  canvas.ontouchmove = (e) => {
    mouse.pos.x = e.touches[0].clientX
    mouse.pos.y = e.touches[0].clientY
  }

  canvas.ontouchend = (e) => {
    mouse.pressed = false
    mouse.leftPressed = false
    mouse.pos.x = e.touches[0].clientX
    mouse.pos.y = e.touches[0].clientY
  }

  document.addEventListener('keydown', toggleStats)
}
