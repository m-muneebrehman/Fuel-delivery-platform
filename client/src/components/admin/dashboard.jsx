import { useState, useEffect } from 'react';
import { MapPin, Users, Bell, ChevronDown, Search, ExternalLink, X, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import PetrolPumpCard from './petrolPumpCard';
import DetailModal from './detailModal';
import { Navbar } from './navbar';

// Hard-coded credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

// Authentication Modal Component
function AuthModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        onLogin(true);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Lock size={20} className="mr-2" />
            Admin Authentication
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Please enter your admin credentials to access the dashboard
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Login
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function AdminHomePage() {
  const [selectedPump, setSelectedPump] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPumps: 0,
    activePumps: 0,
    totalDeliveryBoys: 0,
    pendingRequests: 0
  });

  // Fetch all petrol pumps
  useEffect(() => {
    const fetchPetrolPumps = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch verified pumps
        const pumpsResponse = await fetch(`${apiUrl}/fuelpumps/verified`);
        if (!pumpsResponse.ok) {
          throw new Error('Failed to fetch petrol pumps');
        }
        
        const pumpsData = await pumpsResponse.json();
        console.log('Pumps data:', pumpsData);
        
        if (pumpsData.success) {
          // Transform the data to match the format expected by PetrolPumpCard
          const formattedPumps = pumpsData.data.map(pump => ({
            id: pump._id,
            name: pump.name || 'Unnamed Pump',
            location: pump.location.address || 'No address provided',
            totalDeliveryBoys: pump.deliveryBoys?.length || 0,
            status: pump.status || 'active',
            lastActive: pump.updatedAt || new Date().toISOString(),
            image: pump.logo || "/api/placeholder/400/240"
          }));
          
          setPetrolPumps(formattedPumps);
          
          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            totalPumps: formattedPumps.length,
            activePumps: formattedPumps.filter(p => p.status === 'active').length,
          }));
        }
        
        // Fetch total delivery boys count
        const deliveryBoysCountResponse = await fetch(`${apiUrl}/deliveryBoys/getTotalDeliveryBoys`);
        if (deliveryBoysCountResponse.ok) {
          const deliveryBoysData = await deliveryBoysCountResponse.json();
          if (deliveryBoysData.success) {
            setStats(prevStats => ({
              ...prevStats,
              totalDeliveryBoys: deliveryBoysData.data
            }));
          }
        }
        
        // Fetch pending requests count
        const pendingResponse = await fetch(`${apiUrl}/fuelpumps/requests`);
        const deliveryBoysResponse = await fetch(`${apiUrl}/deliveryboys/unverified`);
        
        if (pendingResponse.ok && deliveryBoysResponse.ok) {
          const pendingData = await pendingResponse.json();
          const deliveryBoysData = await deliveryBoysResponse.json();
          
          const unverifiedPumpsCount = pendingData.success ? pendingData.data.length : 0;
          const unverifiedBoysCount = deliveryBoysData.success ? deliveryBoysData.data.length : 0;
          
          setStats(prevStats => ({
            ...prevStats,
            pendingRequests: unverifiedPumpsCount + unverifiedBoysCount
          }));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPetrolPumps();
  }, [isAuthenticated]);
  
  // Filter petrol pumps based on search
  const filteredPumps = petrolPumps.filter(pump => 
    pump.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pump.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle petrol pump click
  const handlePumpClick = (pump) => {
    setSelectedPump(pump);
  };

  // Check if user is already authenticated in session storage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Store authentication status in session storage
    sessionStorage.setItem('adminAuthenticated', 'true');
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  // If not authenticated, show the authentication modal
  if (!isAuthenticated) {
    return <AuthModal onLogin={handleLoginSuccess} />
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-10 my-37">
      {/* If you already have a navbar, you would include it here */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage petrol pumps and delivery staff</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <Link 
              to="/admin/notifications" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <Bell size={16} className="mr-2" />
              <span>Notifications</span>
              <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {stats.pendingRequests}
              </span>
            </Link>
            
            <Link 
              to="/admin/fuel-prices" 
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <span>Fuel Prices</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-2 sm:mb-0">Registered Petrol Pumps</h2>
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search pumps..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Link 
                      to="/admin/notifications" 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <span className="mr-1">View Requests</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPumps.length > 0 ? (
                    filteredPumps.map(pump => (
                      <PetrolPumpCard 
                        key={pump.id} 
                        pump={pump} 
                        onClick={handlePumpClick}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-gray-500">
                      {petrolPumps.length === 0 ? 'No petrol pumps registered yet.' : 'No petrol pumps found matching your search.'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Statistics Overview</h3>
                    <p className="text-gray-500 text-sm">Summary of your platform's activity</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Petrol Pumps</p>
                    <p className="text-2xl font-bold">{stats.totalPumps}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Active Petrol Pumps</p>
                    <p className="text-2xl font-bold">{stats.activePumps}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Delivery Staff</p>
                    <p className="text-2xl font-bold">{stats.totalDeliveryBoys}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                      <Link 
                        to="/admin/notifications" 
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Detail Modal */}
      {selectedPump && (
        <DetailModal 
          pump={selectedPump} 
          onClose={() => setSelectedPump(null)} 
        />
      )}
    </div>
  );
}