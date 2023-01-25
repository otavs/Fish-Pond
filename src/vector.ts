export default class Vector {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  add(v: Vector) {
    this.x += v.x
    this.y += v.y
    return this
  }

  sub(v: Vector) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  mult(v: number | Vector) {
    if (typeof v == 'number') {
      this.x *= v
      this.y *= v
    } else {
      this.x *= v.x
      this.y *= v.y
    }
    return this
  }

  div(v: number | Vector) {
    if (typeof v == 'number') {
      this.x /= v
      this.y /= v
    } else {
      this.x /= v.x
      this.y /= v.y
    }
    return this
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  normalize() {
    let k = this.mag()
    if (k == 0) this.mult(0)
    else this.div(k)
    return this
  }

  setMag(len: number) {
    return this.normalize().mult(len)
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y
  }

  dist(v: Vector) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2)
  }

  angle() {
    return Math.atan2(this.y, this.x)
  }

  setAngle(angle: number) {
    const mag = this.mag()
    this.x = Math.cos(angle) * mag
    this.y = Math.sin(angle) * mag
    return this
  }

  angleBetween(v: Vector) {
    return v.angle() - this.angle()
  }

  rotate(angle: number) {
    let cos = Math.cos(angle),
      sin = Math.sin(angle),
      x = this.x,
      y = this.y
    this.x = x * cos - y * sin
    this.y = x * sin + y * cos
    return this
  }

  copy(): Vector {
    return new Vector(this.x, this.y)
  }

  limit(lim: number) {
    if (this.mag() > lim) this.normalize().mult(lim)
    return this
  }

  array() {
    return [this.x, this.y]
  }

  static random(mag: number = 1) {
    return new Vector(Math.random() - 0.5, Math.random() - 0.5)
      .normalize()
      .mult(mag)
  }
}
