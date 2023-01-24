import React from 'react'
import styled from 'styled-components'
import { Pane } from 'tweakpane'
import { downloadScreenshot, shuffle } from './pixi-app'
import stats from './stats'

export const params = {
  fish: 200,
  speed: 1.1,
  scale: 1,
  neighbors: 6,
  stats: false,
  bgColor: 0x99dfff,
  alignment: {
    mag: 5,
    limit: 0.2,
    mult: 1,
  },
  separation: {
    mag: 5,
    limit: 0.2,
    mult: 1.1,
  },
  cohesion: {
    mag: 5,
    limit: 0.2,
    mult: 1,
  },
}

const EXPAND_ALL = false

export const pane = new Pane({})

const tab = pane.addTab({
  pages: [{ title: 'Parameters' }, { title: 'Advanced' }],
})

const paramsTab = tab.pages[0]
paramsTab.title = 'Params'
paramsTab.selected = false

const actionsTab = tab.pages[1]
actionsTab.title = 'Actions'

paramsTab.addInput(params.alignment, 'mult', {
  label: 'Alignment',
  min: 0,
  max: 2,
  step: 0.01,
})
paramsTab.addInput(params.separation, 'mult', {
  label: 'Separation',
  min: 0,
  max: 2,
  step: 0.01,
})
paramsTab.addInput(params.cohesion, 'mult', {
  label: 'Cohesion',
  min: 0,
  max: 2,
  step: 0.01,
})

const moreFolder = paramsTab.addFolder({
  title: 'More',
  expanded: false || EXPAND_ALL,
})

moreFolder.addInput(params, 'fish', {
  min: 0,
  max: 1000,
  step: 1,
  label: 'Fish',
})
moreFolder.addInput(params, 'speed', {
  min: 0,
  max: 20,
  step: 0.1,
  label: 'Speed',
})
moreFolder.addInput(params, 'scale', {
  min: 0,
  max: 3,
  step: 0.01,
  label: 'Size',
})
// moreFolder.addInput(params, 'neighbors', {
//   min: 0,
//   max: 100,
//   step: 1,
//   label: 'Neighbors checked',
// })
moreFolder.addInput(params, 'bgColor', {
  label: 'Background',
  view: 'color',
})

moreFolder
  .addInput(params, 'stats', {
    label: 'Stats',
  })
  .on('change', (e) => {
    stats.setVisible(e.value)
  })

// const alignmentFolder = pane.addFolder({
//   title: 'Alignment',
//   expanded: EXPAND_ALL,
// })
// alignmentFolder.addInput(params.alignment, 'mag', {
//   min: 0,
//   max: 20,
//   step: 0.1,
// })
// alignmentFolder.addInput(params.alignment, 'limit', {
//   min: 0,
//   max: 2,
//   step: 0.01,
// })
// paramsFolder.add(alignmentFolder)

// const separationFolder = pane.addFolder({
//   title: 'Separation',
//   expanded: EXPAND_ALL,
// })
// separationFolder.addInput(params.separation, 'mag', {
//   min: 0,
//   max: 20,
//   step: 0.1,
// })
// separationFolder.addInput(params.separation, 'limit', {
//   min: 0,
//   max: 2,
//   step: 0.01,
// })
// paramsFolder.add(separationFolder)

// const cohesionFolder = pane.addFolder({
//   title: 'Cohesion',
//   expanded: EXPAND_ALL,
// })
// cohesionFolder.addInput(params.cohesion, 'mag', {
//   min: 0,
//   max: 20,
//   step: 0.1,
// })
// cohesionFolder.addInput(params.cohesion, 'limit', {
//   min: 0,
//   max: 2,
//   step: 0.01,
// })
// paramsFolder.add(cohesionFolder)

actionsTab.addButton({ title: 'Shuffle' }).on('click', () => shuffle())

// actionsTab
//   .addButton({
//     title: 'Download Screenshot',
//   })
//   .on('click', () => downloadScreenshot())

const paneStyle = pane.element.parentElement!.style
paneStyle.transition = 'opacity 0.25s linear'
setParamsVisibility(false)

export function setParamsVisibility(visible: boolean) {
  paneStyle.opacity = visible ? '1' : '0'
  paneStyle.pointerEvents = visible ? 'auto' : 'none'
}
