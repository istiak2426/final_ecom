// app/(store)/payment/success/page.tsx
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}