import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './UserManagement.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
