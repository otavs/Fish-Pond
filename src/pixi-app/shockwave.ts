import { ShockwaveFilter } from '@pixi/filter-shockwave'
import { Application } from 'pixi.js'
import { mouse } from '../controls'
import Vector from '../vector'

export const shockwaves: Shockwave[] = []

let lastShockwaveTime = performance.now()
let lastShockwavePosition = new Vector()

class Shockwave {
  filter: ShockwaveFilter
  pos: Vector

  constructor() {
    this.pos = new Vector(0, 0)
    this.filter = new ShockwaveFilter(
      [0, 0],
      {
        amplitude: 40,
        wavelength: 30,
        speed: 300,
        radius: 80,
        brightness: 1.03,
      },
      -1
    )
  }

  isActive() {
    return this.filter.time != -1
  }
}

export function initShockwaves(app: Application) {
  app.stage.filters = []
  for (let i = 0; i < 20; i++) {
    const shockwave = new Shockwave()
    shockwaves.push(shockwave)
    app.stage.filters.push(shockwave.filter)
  }
}

export function updateShockwaves(dt: number) {
  const now = performance.now()

  if (mouse.pressed && now - lastShockwaveTime > 100 && !(mouse.pos.dist(lastShockwavePosition) < 50 && now - lastShockwaveTime < 300)) {
    lastShockwaveTime = now
    for (const shockwave of shockwaves) {
      if (!shockwave.isActive()) {
        shockwave.pos = mouse.pos.copy()
        shockwave.filter.time = 0
        shockwave.filter.center = [mouse.pos.x, mouse.pos.y]
        shockwave.filter.radius = 70 + Math.random() * 20
        lastShockwavePosition = mouse.pos.copy()
        break
      }
    }
  }

  for (const shockwave of shockwaves) {
    if (!shockwave.isActive()) continue
    shockwave.filter.time += dt * 0.009
    if (shockwave.filter.time > 0.5) {
      shockwave.filter.time = -1
    }
  }
}
