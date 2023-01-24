import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { pane, setParamsVisibility } from '../params'
import { BsGear } from 'react-icons/bs'
import { TfiClose } from 'react-icons/tfi'
import { BsChevronRight } from 'react-icons/bs'

export function ToggleParams() {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => setParamsVisibility(isOpen), [isOpen])

  const paneStyle = getComputedStyle(pane.element.parentElement!)
  const top = `calc(${paneStyle.top} - 1px)`
  const right = top
  const rightOpen = `calc(${paneStyle.right} + ${paneStyle.width})`

  const toggleProps = {
    right: isOpen ? rightOpen : right,
    top,
    onClick: () => setOpen(!isOpen),
  }

  return (
    <>
      <Toggle {...toggleProps} active={!isOpen}>
        <BsGear size={20} />
      </Toggle>
      <Toggle {...toggleProps} active={isOpen}>
        <BsChevronRight size={18} />
      </Toggle>
    </>
  )
}

const Toggle = styled.button<{ top: string; right: string; active: boolean }>`
  transition: right 0.2s linear, opacity 0.25s linear;
  opacity: ${({ active }) => (active ? 0.4 : 0)};
  position: absolute;
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
  margin: 3px;
  border-radius: 10px;
  background-color: transparent;
  border: 0;
  padding: 0;
  z-index: 10;
  outline: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    outline: solid;
    outline-color: #002fff;
    outline-width: 1px;
  }
`
