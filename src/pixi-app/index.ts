import { Application, Graphics } from 'pixi.js'
import { stats } from '../stats'
import Vector from '../vector'
import { Fish1 } from './fish/fish1'

const fishList: Fish1[] = []

export async function createPixiApp(
  canvas: HTMLCanvasElement
): Promise<Application> {
  const app = new Application({
    view: canvas,
    backgroundColor: 0x99dfff,
    resizeTo: window,
  })

  document.body.appendChild(app.view as any)

  for (let i = 0; i < 200; i++) {
    const pos = new Vector(
      Math.random() * app.view.width,
      Math.random() * app.view.height
    )
    const fish = new Fish1(pos)
    fishList.push(fish)
    fish.vel = Vector.random()
    app.stage.addChild(fish.anim)
    app.stage.addChild(fish.arc)

    // const centerPoint = new Graphics()
    // centerPoint.beginFill(0xff0000)
    // centerPoint.drawCircle(pos.x, pos.y, 2)
    // centerPoint.endFill()
    // app.stage.addChild(centerPoint)
  }

  app.ticker.add((dt) => {
    stats.update()
    for (const fish of fishList) {
      fish.preUpdate(dt, fishList)
    }
    for (const fish of fishList) {
      fish.update(dt, app)
    }
  })

  return app
}
