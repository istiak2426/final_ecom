'use client'
import Link from 'next/link'
import { useCart } from './CartContext'

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    })
  }

  return (
    <div className="border rounded-lg p-4 shadow">
      <Link href={`/product/${product.id}`}>
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
        <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
        <p className="text-gray-600">${product.price}</p>
      </Link>
      <button onClick={addToCart} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  )
}