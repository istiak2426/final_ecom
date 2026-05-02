'use client';

import { useCart } from '@/components/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
    >
      Add to Cart
    </button>
  );
}
