import { AnimatedSprite, Application, Graphics } from 'pixi.js'
import Vector from '../../vector'
import { fish1Sheet } from '../spritesheets'
import { ColorReplaceFilter } from '@pixi/filter-color-replace'

export class Fish1 {
  pos: Vector
  vel: Vector
  acc: Vector
  anim: AnimatedSprite
  width: number
  height: number
  isDead: boolean = false
  scale: number = 0.2
  arc: Graphics
  radius: number

  constructor(pos: Vector) {
    this.pos = pos
    this.vel = new Vector(0, 0)
    this.acc = new Vector(0, 0)
    this.radius = 100

    this.anim = new AnimatedSprite(fish1Sheet.animations.fish)
    this.anim.animationSpeed = 1
    this.anim.pivot.set(this.anim.width / 2, this.anim.height / 2)
    this.anim.scale.x = this.anim.scale.y = this.scale
    const color = Math.random() * 0xffffff
    this.anim.filters = [new ColorReplaceFilter(0x000000, color, 0.001)]
    this.anim.animationSpeed = 0.7
    this.anim.currentFrame = Math.floor(Math.random() * this.anim.totalFrames)
    this.anim.play()

    this.width = this.anim.width
    this.height = this.anim.height

    this.arc = new Graphics()
    this.arc.beginFill(0x000000)
    this.arc.drawCircle(0, 0, this.radius)
    this.arc.endFill()
    this.arc.alpha = 0.02 * 0
  }

  preUpdate(dt: number, fishList: Fish1[]) {
    this.acc.mult(0)
    this.acc.add(this.alignment(fishList))
    this.acc.add(
      this.separation(
        fishList.filter((f) => f !== this && this.pos.dist(f.pos) < this.radius)
      )
    )
    this.acc.add(
      this.cohesion(
        fishList.filter(
          (f) => f !== this && this.pos.dist(f.pos) < this.radius * 1.8
        )
      )
    )
  }

  update(dt: number, app: Application) {
    this.vel.add(this.acc.copy().mult(dt))
    this.pos.add(this.vel.copy().mult(dt))
    this.anim.position.x = this.pos.x
    this.anim.position.y = this.pos.y
    this.anim.rotation = this.vel.angle()
    this.anim.scale.y = (this.vel.x < 0 ? -1 : 1) * this.scale

    this.arc.position.x = this.pos.x
    this.arc.position.y = this.pos.y

    if (this.pos.x > app.view.width + this.width / 2)
      this.pos.x = -this.width / 2
    if (this.pos.x < -this.width / 2)
      this.pos.x = app.view.width + this.width / 2
    if (this.pos.y > app.view.height + this.height / 2)
      this.pos.y = -this.height / 2
    if (this.pos.y < -this.height / 2)
      this.pos.y = app.view.height + this.height / 2

    const turnFactor = 0.1
    const marginX = 150
    const marginY = 100
    if (this.pos.x < marginX) this.vel.x = this.vel.x + turnFactor
    if (this.pos.x > app.view.width - marginX)
      this.vel.x = this.vel.x - turnFactor
    if (this.pos.y < marginY) this.vel.y = this.vel.y + turnFactor
    if (this.pos.y > app.view.height - marginY)
      this.vel.y = this.vel.y - turnFactor
  }

  destroy() {
    this.anim.destroy()
    this.isDead = true
  }

  alignment(fishList: Fish1[]) {
    const others = this.filterByRadius(fishList, this.radius)
    const steer = new Vector(0, 0)
    for (const other of others) {
      steer.add(other.vel)
    }
    if (others.length) {
      steer.div(others.length).setMag(5).sub(this.vel).limit(0.2)
    }
    return steer
  }

  separation(fishList: Fish1[]) {
    const others = this.filterByRadius(fishList, this.radius)
    const steer = new Vector(0, 0)
    for (const other of others) {
      const dist = this.pos.dist(other.pos)
      const diff = this.pos
        .copy()
        .sub(other.pos)
        .div(dist ** 2)
      steer.add(diff)
    }
    if (others.length) {
      steer.div(others.length).setMag(5).sub(this.vel).limit(0.2)
    }
    return steer
  }

  cohesion(fishList: Fish1[]) {
    const others = this.filterByRadius(fishList, this.radius * 1.8)
    const steer = new Vector(0, 0)
    for (const other of others) {
      steer.add(other.pos)
    }
    if (others.length) {
      steer.div(others.length).sub(this.pos).setMag(5).sub(this.vel).limit(0.2)
    }
    return steer
  }

  filterByRadius(fishList: Fish1[], radius: number) {
    return fishList.filter(
      (f) => f !== this && this.pos.dist(f.pos) < this.radius
    )
  }
}
