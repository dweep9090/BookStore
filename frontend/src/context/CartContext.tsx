import { createContext, useContext, useState, useEffect} from 'react'
import type {ReactNode} from 'react'
import api from '../api/axios'

interface CartItem { id: string; book: { id: string; title: string; price: number; coverUrl: string }; quantity: number }
interface CartContextType {
  items: CartItem[]; count: number; fetchCart: () => void; clearCart: () => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart')
      setItems(data.data || [])
    } catch { setItems([]) }
  }

  useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    fetchCart();
  }
}, []);

  return (
    <CartContext.Provider value={{ items, count: items.reduce(
  (total, item) => total + item.quantity,
  0
), fetchCart, clearCart: () => setItems([]) }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)