import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'; // Paquete para gestionar los idiomas
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@context/ThemeContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
