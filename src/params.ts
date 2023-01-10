import { Pane } from 'tweakpane'

export const params = {
  fish: 200,
}

const pane = new Pane({})

pane.addInput(params, 'fish', { min: 0, max: 2000, step: 1 })