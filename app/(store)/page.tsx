import { supabase } from '@/lib/supabaseClient'
import ProductCard from '@/components/ProductCard'

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*')
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}