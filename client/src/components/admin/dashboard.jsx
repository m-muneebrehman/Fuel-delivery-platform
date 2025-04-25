import { useState } from 'react';
import { MapPin, Users, Bell, ChevronDown, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import PetrolPumpCard from './petrolPumpCard';
import DetailModal from './detailModal';
import { Navbar } from './navbar';

// Dummy data for petrol pumps
const dummyPetrolPumps = [
  {
    id: 1,
    name: "City Fuel Station",
    location: "123 Main Street, Downtown",
    totalDeliveryBoys: 8,
    status: "active",
    lastActive: "2025-04-24T15:30:00",
    image: "/api/placeholder/400/240"
  },
  {
    id: 2,
    name: "Highway Express Fuel",
    location: "456 Highway Road, Westside",
    totalDeliveryBoys: 12,
    status: "active",
    lastActive: "2025-04-24T14:45:00",
    image: "/api/placeholder/400/240"
  },
  {
    id: 3,
    name: "QuickStop Petrol",
    location: "789 East Avenue, Northside",
    totalDeliveryBoys: 5,
    status: "active",
    lastActive: "2025-04-24T12:15:00",
    image: "/api/placeholder/400/240"
  },
  {
    id: 4,
    name: "Metro Fuel Services",
    location: "234 Central Blvd, Eastside",
    totalDeliveryBoys: 10,
    status: "active",
    lastActive: "2025-04-23T18:30:00",
    image: "/api/placeholder/400/240"
  },
  {
    id: 5,
    name: "Suburban Gas Station",
    location: "567 Park Road, Southside",
    totalDeliveryBoys: 6,
    status: "active",
    lastActive: "2025-04-23T16:45:00",
    image: "/api/placeholder/400/240"
  }
];

// Dummy data for pending requests count
const pendingRequestsCount = 4;

// Main component
export default function AdminHomePage() {
  const [selectedPump, setSelectedPump] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter petrol pumps based on search
  const filteredPumps = dummyPetrolPumps.filter(pump => 
    pump.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pump.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle petrol pump click
  const handlePumpClick = (pump) => {
    setSelectedPump(pump);
  };
  
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
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Link 
              to="/admin/notifications" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <Bell size={16} className="mr-2" />
              <span>Notifications</span>
              <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {pendingRequestsCount}
              </span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                  No petrol pumps found matching your search.
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
                <p className="text-2xl font-bold">{dummyPetrolPumps.length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Active Petrol Pumps</p>
                <p className="text-2xl font-bold">{dummyPetrolPumps.filter(p => p.status === 'active').length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Delivery Staff</p>
                <p className="text-2xl font-bold">
                  {dummyPetrolPumps.reduce((total, pump) => total + pump.totalDeliveryBoys, 0)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{pendingRequestsCount}</p>
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
        </div>
        
        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Petrol Pump
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, idx) => {
                  const pump = dummyPetrolPumps[idx % dummyPetrolPumps.length];
                  const activities = [
                    "Added new delivery staff", 
                    "Updated location details", 
                    "Completed 5 deliveries", 
                    "Changed operating hours",
                    "Updated fuel prices"
                  ];
                  const timeAgo = ["2 hours ago", "5 hours ago", "Yesterday", "2 days ago", "3 days ago"];
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => handlePumpClick(pump)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{pump.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{pump.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin size={14} className="mr-1 text-gray-400" />
                          {pump.location.split(',')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{activities[idx]}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {timeAgo[idx]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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