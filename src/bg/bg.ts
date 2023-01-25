import Color from 'color'
import { Application, Filter, Sprite, Texture } from 'pixi.js'
import { params } from '../params'
import fragShader from './bg.frag'

export class Background {
  app: Application
  sprite: Sprite
  filter: Filter

  constructor(app: Application) {
    this.app = app

    // const bg = new Graphics()
    // bg.beginFill(0xffff00)
    // bg.lineStyle(5, 0xff0000)
    // bg.drawRect(0, 0, app.view.width, app.view.height)

    this.sprite = Sprite.from(Texture.WHITE, {
      width: app.view.width,
      height: app.view.height,
    })

    this.filter = new Filter(undefined, fragShader, {
      iTime: 0,
      iResolution: [app.view.width, app.view.height],
    })

    this.sprite.filters = [this.filter]

    app.stage.addChild(this.sprite)
  }

  update(dt: number) {
    this.sprite.visible = params.water
    if (!this.sprite.visible) return
    this.sprite.width = this.app.view.width
    this.sprite.height = this.app.view.height
    this.filter.uniforms.iTime += dt * 0.01
    this.filter.uniforms.iResolution = [this.app.view.width, this.app.view.height]
    this.filter.uniforms.texture_color = Color(params.bgColor).unitArray()
  }
}
