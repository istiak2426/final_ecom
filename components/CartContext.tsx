'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  getTotal: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + product.quantity }
            : i
        )
      }
      return [...prev, { ...product, quantity: product.quantity }]
    })
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeItem(id)
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)))
  }

  const getTotal = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, getTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}