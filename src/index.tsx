import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

import styled from 'styled-components'
import { ToggleParams } from './components/ToggleParams'
import { registerEvents } from './controls'
import { createPixiApp } from './pixi-app'
import { initStats } from './stats'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    createPixiApp(canvasRef.current!)
    registerEvents(canvasRef.current!)
    initStats()
  }, [])
  return (
    <>
      <Canvas ref={canvasRef} tabIndex={1} />
      <ToggleParams />
    </>
  )
}

const Canvas = styled.canvas`
  outline: none;
`

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
