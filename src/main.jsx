import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'; // Paquete para gestionar los idiomas
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@context/ThemeContext";

/**
 * Punto de entrada de la aplicación React.
 * Aquí se renderiza el componente principal de la aplicación y se envuelve en un proveedor de tema.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
