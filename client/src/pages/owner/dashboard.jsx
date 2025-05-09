import { ShoppingBag, Package, Filter, Clock } from 'lucide-react';
import { Navbar } from '@/components/poDash/Navbar';
import Products from '@/components/poDash/Products';
import Orders from '@/components/poDash/Orders'

export default function OrdersProductsPage() {

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-50 px-4 sm:px-6 lg:px-8">
        {/* Orders Section */}
        <Orders />
        
        {/* Products Section */}
        <Products />
      </main>
    </div>
  );
}