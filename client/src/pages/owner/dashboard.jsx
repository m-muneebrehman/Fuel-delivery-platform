import { ShoppingBag, Package, Filter, Clock } from 'lucide-react';
import { Navbar } from '@/components/poDash/Navbar';
import Orders from '@/components/poDash/Orders'

export default function OrdersProductsPage() {

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ff] via-[#f5f7fa] to-[#c7d2fe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-x-hidden">
      {/* Decorative background shapes removed for performance */}
      <Navbar />
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-20 md:py-28">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 backdrop-blur-md">
          {/* Orders Section */}
          <Orders />
        </div>
      </main>
    </div>
  );
}