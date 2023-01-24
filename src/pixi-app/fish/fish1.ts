import { AnimatedSprite, Application, Graphics, utils } from 'pixi.js'
import Vector from '../../vector'
import { fish1Sheet } from '../spritesheets'
import { ColorReplaceFilter } from '@pixi/filter-color-replace'
import { mouse } from '../../controls'
import { Client, SpatialHash } from '../../SpatialHash'
import { params } from '../../params'
import Color from 'color'

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
  client: Client
  spatialHash: SpatialHash

  constructor(pos: Vector, spatialHash: SpatialHash) {
    this.pos = pos
    this.vel = new Vector(0, 0)
    this.acc = new Vector(0, 0)
    this.radius = 100

    this.anim = new AnimatedSprite(fish1Sheet.animations.fish)
    this.anim.position.x = this.pos.x
    this.anim.position.y = this.pos.y
    this.anim.animationSpeed = 1
    this.anim.pivot.set(this.anim.width / 2, this.anim.height / 2)
    this.anim.scale.x = this.anim.scale.y = this.scale
    // this.anim.filters = [new ColorReplaceFilter(0x000000, color, 0.001)]
    const color = Color.hsv(Math.random() * 360, 255, 90)
    this.anim.tint = color.rgbNumber()
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

    this.spatialHash = spatialHash
    this.client = spatialHash.newClient([pos.x, pos.y], [200, 200], this)
  }

  preUpdate() {
    this.acc.mult(0)
    if (
      params.alignment.mult != 0 ||
      params.separation.mult != 0 ||
      params.cohesion.mult != 0
    ) {
      const others = this.spatialHash.findNear(
        [this.pos.x, this.pos.y],
        [0, 0],
        params.neighbors
      )
      params.alignment.mult != 0 && this.alignment(others)
      params.separation.mult != 0 && this.separation(others)
      params.cohesion.mult != 0 && this.cohesion(others)
    }
  }

  update(dt: number, app: Application) {
    if (isNaN(this.pos.x)) console.log('F')

    this.vel.add(this.acc.copy().mult(dt))
    this.pos.add(this.vel.copy().mult(dt * params.speed))
    this.anim.position.x = this.pos.x
    this.anim.position.y = this.pos.y
    this.anim.rotation = this.vel.angle()
    this.anim.scale.x = this.scale * params.scale
    this.anim.scale.y = (this.vel.x < 0 ? -1 : 1) * this.scale * params.scale

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

    const turnFactor = 0.05
    const marginX = 0.07 * app.view.width
    const marginY = 0.07 * app.view.height
    if (this.pos.x < marginX) this.vel.x += turnFactor
    if (this.pos.x > app.view.width - marginX) this.vel.x -= turnFactor
    if (this.pos.y < marginY) this.vel.y += turnFactor
    if (this.pos.y > app.view.height - marginY) this.vel.y -= turnFactor

    this.client.position = [this.pos.x, this.pos.y]
    this.spatialHash.updateClient(this.client)
  }

  destroy() {
    this.anim.destroy()
    this.arc.destroy()
    this.spatialHash.remove(this.client)
    this.isDead = true
  }

  alignment(others: Fish1[]) {
    const steer = new Vector(0, 0)
    let count = 0
    for (const other of others) {
      if (other !== this && this.pos.dist(other.pos) < this.radius) {
        steer.add(other.vel)
        count++
      }
    }
    if (count) {
      steer
        .div(count)
        .setMag(params.alignment.mag)
        .sub(this.vel)
        .limit(params.alignment.limit)
        .mult(params.alignment.mult)
    }
    this.acc.add(steer)
  }

  separation(others: Fish1[]) {
    const steer = new Vector(0, 0)
    let count = 0
    for (const other of others) {
      const dist = this.pos.dist(other.pos)
      if (other !== this && dist < this.radius) {
        const diff = this.pos
          .copy()
          .sub(other.pos)
          .div(dist ** 2)
        steer.add(diff)
        count++
      }
    }
    if (count) {
      steer
        .div(count)
        .setMag(params.separation.mag)
        .sub(this.vel)
        .limit(params.separation.limit)
        .mult(params.separation.mult)
    }
    this.acc.add(steer)
  }

  cohesion(others: Fish1[]) {
    const steer = new Vector(0, 0)
    let count = 0
    for (const other of others) {
      if (other !== this && this.pos.dist(other.pos) < this.radius) {
        steer.add(other.pos)
        count++
      }
    }
    if (count) {
      steer
        .div(count)
        .sub(this.pos)
        .setMag(params.cohesion.mag)
        .sub(this.vel)
        .limit(params.cohesion.limit)
        .mult(params.cohesion.mult)
    }
    this.acc.add(steer)
  }
}
