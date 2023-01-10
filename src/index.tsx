import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

import { registerEvents } from './controls'
import { createPixiApp } from './pixi-app'
import styled from 'styled-components'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    createPixiApp(canvasRef.current!)
    registerEvents(canvasRef.current!)
  }, [])
  return (
    <>
      <Canvas ref={canvasRef} tabIndex={1}></Canvas>
    </>
  )
}

const Canvas = styled.canvas`
  outline: none;
`

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
