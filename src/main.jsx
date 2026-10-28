import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { SettingsProvider } from './context/SettingsContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <SettingsProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </SettingsProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
