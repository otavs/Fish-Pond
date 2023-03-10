import { Application, Graphics } from 'pixi.js'
import { params } from '../params'
import { SpatialHash } from '../SpatialHash'
import { stats } from '../stats'
import Vector from '../vector'
import { Fish1 } from './fish/fish1'
import { Background } from '../bg/bg'
import { createGrid } from './grid'
import { initShockwaves, updateShockwaves } from './shockwave'

const fishList: Fish1[] = []

let app: Application

export async function createPixiApp(canvas: HTMLCanvasElement): Promise<Application> {
  app = new Application({
    view: canvas,
    backgroundColor: params.bgColor,
    resizeTo: window,
    preserveDrawingBuffer: true
  })

  document.body.appendChild(app.view as HTMLCanvasElement)

  const bg = new Background(app)

  const spatialHash = new SpatialHash(
    [
      [0, 0],
      [app.view.width, app.view.width],
    ],
    [25, 25]
  )

  initShockwaves(app)
  // createGrid(app)

  for (let i = 0; i < params.fish; i++) createFish(app, spatialHash)

  app.ticker.add((dt) => {
    stats.update()
    ;(app.renderer as any).background.color = params.bgColor

    for (const fish of fishList) fish.preUpdate()
    for (const fish of fishList) fish.update(dt, app)

    if (fishList.length != params.fish) {
      while (fishList.length > params.fish) fishList.pop()?.destroy()
      while (fishList.length < params.fish) createFish(app, spatialHash)
    }

    bg.update(dt)
    updateShockwaves(dt)
  })

  return app
}

function createFish(app: Application, spatialHash: SpatialHash) {
  const pos = new Vector(Math.random() * app.view.width, Math.random() * app.view.height)

  const fish = new Fish1(pos, spatialHash)
  fishList.push(fish)
  fish.vel = Vector.random()
  app.stage.addChild(fish.anim)
  // app.stage.addChild(fish.arc)
}

export function shuffle() {
  for (const fish of fishList) {
    fish.pos.x = Math.random() * window.innerWidth
    fish.pos.y = Math.random() * window.innerHeight
    fish.vel = Vector.random()
  }
}

export function downloadScreenshot() {
  if (!app || !app.view) {
    console.error('Empty app or canvas')
    return
  }
  const downloadLink = document.createElement('a')
  downloadLink.id = 'downloadLink'
  downloadLink.download = 'fish.png'
  document.body.appendChild(downloadLink)
  const canvas = app.view as HTMLCanvasElement
  downloadLink.href = canvas.toDataURL('image/png')
  downloadLink.click()
}
