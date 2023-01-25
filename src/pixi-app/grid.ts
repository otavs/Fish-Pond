import { Application, Graphics } from "pixi.js"

export function createGrid(app: Application) {
  const grid = new Graphics()

  grid.lineStyle(1, 0x000000)

  for (let i = 0; i <= app.view.height; i += 20) {
    grid.moveTo(0, i)
    grid.lineTo(app.view.width, i)
  }

  for (let i = 0; i <= app.view.width; i += 20) {
    grid.moveTo(i, 0)
    grid.lineTo(i, app.view.height)
  }

  app.stage.addChild(grid)

  return grid
}
