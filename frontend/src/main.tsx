import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {SearchProvider} from './context/SearchContext.tsx'
import {AuthProvider} from './context/AuthContext.tsx'
import {CartProvider} from './context/CartContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </SearchProvider>
  </StrictMode>,
)
