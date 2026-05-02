// app/page.tsx
import { supabase } from '@/lib/supabaseClient'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  // Fetch all products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {(!products || products.length === 0) && (
        <p className="text-center text-gray-500 mt-10">No products available.</p>
      )}
    </div>
  )
}