'use client'
import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        total: getTotal(),
        customer: form,
      }),
    })

    const data = await res.json()
    if (data.redirectUrl) {
      // Clear cart only after successful payment? Better keep for now
      // Redirect to SSLCommerz payment page
      window.location.href = data.redirectUrl
    } else {
      alert('Payment initiation failed')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return <div className="p-4">Cart is empty</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-2">Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="text-right font-bold mt-4">Total: ${getTotal().toFixed(2)}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            placeholder="Address"
            required
            className="w-full border p-2 rounded"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded w-full"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  )
}