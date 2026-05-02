// app/(store)/product/[id]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15+ uses async params
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  // Fetch product from Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-700 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
