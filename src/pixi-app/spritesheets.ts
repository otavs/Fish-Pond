import { BaseTexture, Spritesheet } from 'pixi.js'
import fish1 from '../assets/fish1.json'

export const fish1Sheet = new Spritesheet(
  BaseTexture.from(fish1.meta.image),
  fish1
)

fish1Sheet.parse()