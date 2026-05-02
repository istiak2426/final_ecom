// app/(store)/payment/cancel/page.tsx
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-yellow-500 text-6xl mb-4">!</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You have cancelled the payment process. No charges were made.
        </p>
        <Link
          href="/cart"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go back to Cart
        </Link>
      </div>
    </div>
  );
}