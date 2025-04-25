import { useState } from 'react';
import { ShoppingCart, Search, Heart, Filter, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SparePartsStore() {
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Electrical',
    'Oils & Fluids',
  ];

  const products = [
    {
      id: 1,
      name: 'Oil Filter',
      category: 'Engine Parts',
      price: 12.99,
      rating: 4.5,
      image: '/api/placeholder/240/160',
      description: 'High-quality oil filter for all vehicle types'
    },
    {
      id: 2,
      name: 'Brake Pads (Set of 4)',
      category: 'Brake System',
      price: 45.99,
      rating: 4.7,
      image: '/api/placeholder/240/160',
      description: 'Ceramic brake pads for superior braking performance'
    },
    {
      id: 3,
      name: 'Spark Plugs',
      category: 'Engine Parts',
      price: 8.99,
      rating: 4.6,
      image: '/api/placeholder/240/160',
      description: 'Premium spark plugs for improved fuel efficiency'
    },
    {
      id: 4,
      name: 'Shock Absorber',
      category: 'Suspension',
      price: 89.99,
      rating: 4.8,
      image: '/api/placeholder/240/160',
      description: 'Heavy-duty shock absorber for a smooth ride'
    },
    {
      id: 5,
      name: 'Alternator',
      category: 'Electrical',
      price: 129.99,
      rating: 4.4,
      image: '/api/placeholder/240/160',
      description: 'High-output alternator for various vehicle applications'
    },
    {
      id: 6,
      name: 'Engine Oil (5L)',
      category: 'Oils & Fluids',
      price: 32.99,
      rating: 4.9,
      image: '/api/placeholder/240/160',
      description: 'Synthetic engine oil for optimal engine protection'
    },
    {
      id: 7,
      name: 'Air Filter',
      category: 'Engine Parts',
      price: 15.99,
      rating: 4.3,
      image: '/api/placeholder/240/160',
      description: 'Performance air filter for better airflow'
    },
    {
      id: 8,
      name: 'Brake Fluid (1L)',
      category: 'Brake System',
      price: 11.99,
      rating: 4.6,
      image: '/api/placeholder/240/160',
      description: 'DOT 4 brake fluid for hydraulic brake systems'
    },
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const addToCart = (product) => {
    setCart([...cart, product]);
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#dc2626',
      timer: 1500
    });
  };

  const buyNow = (product) => {
    Swal.fire({
      title: 'Proceed to Checkout?',
      text: `You are about to purchase ${product.name} for $${product.price}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, Buy Now!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Order Placed!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          confirmButtonColor: '#dc2626',
          timer: 2000
        });
      }
    });
  };

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-500">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-100 my-32">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg mb-8 overflow-hidden relative">
          <div className="md:flex items-center">
            <div className="p-6 md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Spring Sale: 25% OFF All Brake Components</h2>
              <p className="mb-6">Upgrade your vehicle's braking system with our premium parts and enjoy safer drives!</p>
              <button className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
                Shop Now
              </button>
            </div>
            <div className="md:w-1/2 h-64 bg-gray-300">
              <img src="/bg-car.jpg" alt="Brake components on sale" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Categories and Products */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md h-fit hidden md:block">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category}>
                  <button 
                    className={`flex items-center w-full text-left px-2 py-2 rounded-md transition ${activeCategory === category ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <ChevronRight size={16} className={`mr-2 ${activeCategory === category ? 'text-red-600' : 'text-gray-400'}`} />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  Price Range
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="flex items-center space-x-4 mb-4">
                  <input type="range" className="w-full accent-red-600" min="0" max="200" step="10" />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$0</span>
                  <span>$200</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  Brands
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {['Bosch', 'ACDelco', 'Denso', 'Valeo', 'NGK'].map(brand => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  Compatibility
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes'].map(make => (
                    <label key={make} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                      <span>{make}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition flex items-center justify-center">
                <Filter size={16} className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm hidden md:inline">
                  Showing {filteredProducts.length} results
                </span>
                <select className="bg-white border rounded-md px-2 py-1 text-sm text-gray-700 focus:ring-red-500 focus:border-red-500">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-gray-200 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                      <Heart size={18} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <span className="text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-1">{product.category}</span>
                    <h3 className="font-bold text-lg mt-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    
                    <div className="flex items-center mt-2">
                      <div className="flex">{renderRating(product.rating)}</div>
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-xl text-gray-800">${product.price}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          onClick={() => buyNow(product)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">&laquo;</button>
                <button className="px-3 py-1 rounded-md bg-red-600 text-white">1</button>
                <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">2</button>
                <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">3</button>
                <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">&raquo;</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AutoParts Hub</h3>
              <p className="text-gray-400">Your one-stop solution for all vehicle spare parts. Quality products at competitive prices.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Shop', 'About Us', 'Contact', 'Blog'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Customer Support</h4>
              <ul className="space-y-2">
                {['FAQ', 'Shipping Policy', 'Returns & Refunds', 'Track Order', 'Privacy Policy'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Subscribe to Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
              <div className="mt-4 flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(social => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 AutoParts Hub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
              <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
              <img src="/api/placeholder/40/25" alt="PayPal" className="h-6" />
              <img src="/api/placeholder/40/25" alt="Apple Pay" className="h-6" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}