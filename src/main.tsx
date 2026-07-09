import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TemplateApp } from './App'
import './index.css'

const rootElement = document.getElementById('root')

if (rootElement instanceof HTMLElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <TemplateApp />
    </StrictMode>,
  )
} else {
  throw new Error('Root element was not found')
}
