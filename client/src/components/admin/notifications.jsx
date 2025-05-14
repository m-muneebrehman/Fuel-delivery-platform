import { useState, useEffect } from 'react';
import { MapPin, Users, Check, X, ChevronDown, Eye, ArrowLeft, Filter} from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import RequestCard from './requestCard'; // Import your RequestCard component
import RequestDetailsModal from './detailModal' // Import your RequestDetailsModal component

export default function NotificationsPage() {
  const [requestType, setRequestType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch fuel pump requests
        const pumpResponse = await fetch(`${import.meta.env.VITE_API_URL}/fuelpumps/requests`,
          {
            method: 'GET'
          }
        );

        if (!pumpResponse.ok) {
          throw new Error('Failed to fetch pump requests');
        }

        const pumpData = await pumpResponse.json();
        
        if (!pumpData.success) {
          throw new Error(pumpData.message || 'Failed to fetch pump requests');
        }

        // Transform pump data
        const transformedPumpRequests = pumpData.data.map(pump => ({
          id: pump._id,
          type: "petrol_pump",
          name: pump.name,
          location: pump.location.address,
          requestDate: pump.createdAt,
          status: pump.status || 'pending',
          documents: pump.documents || [],
          coordinates: pump.location.coordinates,
          contactInfo: {
            phone: pump.phone,
            email: pump.email
          },
          fuelTypes: pump.fuelTypes || [],
          operatingHours: pump.operatingHours || {},
          additionalInfo: pump.additionalInfo || {}
        }));

        // Fetch delivery boy requests
        const deliveryBoyResponse = await fetch(`${import.meta.env.VITE_API_URL}/deliveryboys/unverified`,
          {
            method: 'GET'
          }
        );

        if (!deliveryBoyResponse.ok) {
          throw new Error('Failed to fetch delivery boy requests');
        }

        const deliveryBoyData = await deliveryBoyResponse.json();
        
        if (!deliveryBoyData.success) {
          throw new Error(deliveryBoyData.message || 'Failed to fetch delivery boy requests');
        }

        // Transform delivery boy data
        const transformedDeliveryBoyRequests = deliveryBoyData.data.map(boy => ({
          id: boy._id,
          type: "delivery_boy",
          name: boy.fullName,
          location: boy.address,
          requestDate: boy.createdAt,
          status: boy.status || 'pending',
          documents: [],
          photo: boy.photo,
          contactInfo: {
            phone: boy.phoneNumber,
            email: boy.email,
            cnic: boy.cnicNumber
          },
          fuelPump: boy.fuelPump
        }));

        // Combine both types of requests
        setRequests([...transformedPumpRequests, ...transformedDeliveryBoyRequests]);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);
  
  // Filter requests based on type only
  const filteredRequests = requests.filter(request => {
    return requestType === 'all' || request.type === requestType;
  });
  
  // Handle request actions
  const handleApproveRequest = async (request) => {
    try {
      let response;
      
      if (request.type === "petrol_pump") {
        response = await fetch(`${import.meta.env.VITE_API_URL}/fuelpumps/${request.id}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else if (request.type === "delivery_boy") {
        response = await fetch(`${import.meta.env.VITE_API_URL}/deliveryboys/${request.id}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to approve ${request.type} request`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || `Failed to approve ${request.type} request`);
      }

      // Update the request status in the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request.id ? { ...req, status: 'approved' } : req
        )
      );

      setSelectedRequest(null);
      alert(`Request from ${request.name} approved successfully!`);
    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.message);
    }
  };
  
  const handleRejectRequest = async (request) => {
    try {
      let response;
      
      if (request.type === "petrol_pump") {
        response = await fetch(`${import.meta.env.VITE_API_URL}/fuelpumps/${request.id}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else if (request.type === "delivery_boy") {
        response = await fetch(`${import.meta.env.VITE_API_URL}/deliveryboys/${request.id}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to reject ${request.type} request`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || `Failed to reject ${request.type} request`);
      }

      // Update the request status in the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request.id ? { ...req, status: 'rejected' } : req
        )
      );

      setSelectedRequest(null);
      alert(`Request from ${request.name} rejected successfully!`);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.message);
    }
  };
  
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* If you already have a navbar, you would include it here */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center mb-6">
          <Link to="/admin" className="flex items-center text-blue-600 hover:text-blue-800 mr-3">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Requests</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <h2 className="text-lg font-medium">Pending Requests</h2>
                <p className="text-gray-500 text-sm mt-1">Review and manage incoming requests</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                <div className="relative">
                  <select
                    className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="petrol_pump">Petrol Pumps</option>
                    <option value="delivery_boy">Delivery Staff</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading requests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-600">
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-1">Please try again later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                      onView={handleViewRequest}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-gray-500">
                    <Filter size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No requests match your filters</p>
                    <p className="text-sm mt-1">Try changing your filter settings or check back later</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Request details modal */}
        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
}