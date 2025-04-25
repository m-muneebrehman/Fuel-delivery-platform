import { useState } from 'react';
import { MapPin, Users, Check, X, ChevronDown, Eye, ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import RequestCard from './requestCard'; // Import your RequestCard component
import RequestDetailsModal from './detailModal'; // Import your RequestDetailsModal component

// Dummy data for requests
const dummyRequests = [
  {
    id: 101,
    type: "petrol_pump",
    name: "Green Energy Fuels",
    location: "890 Green Street, Westend",
    requestDate: "2025-04-24T09:15:00",
    status: "pending",
    documents: ["license.pdf", "permit.pdf", "insurance.pdf"]
  },
  {
    id: 102,
    type: "delivery_boy",
    name: "John Smith",
    petrolPump: "City Fuel Station",
    requestDate: "2025-04-23T14:30:00",
    status: "pending",
    documents: ["id.pdf", "license.pdf"]
  },
  {
    id: 103,
    type: "petrol_pump",
    name: "Valley Fuel Center",
    location: "432 Valley Road, Eastend",
    requestDate: "2025-04-22T11:45:00",
    status: "pending",
    documents: ["license.pdf", "permit.pdf", "insurance.pdf"]
  },
  {
    id: 104,
    type: "delivery_boy",
    name: "Michael Johnson",
    petrolPump: "Highway Express Fuel",
    requestDate: "2025-04-21T16:20:00",
    status: "pending",
    documents: ["id.pdf", "license.pdf"]
  }
];

export default function NotificationsPage() {
  const [requestStatus, setRequestStatus] = useState('all');
  const [requestType, setRequestType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Filter requests based on status and type
  const filteredRequests = dummyRequests.filter(request => {
    const matchesType = requestType === 'all' || request.type === requestType;
    const matchesStatus = requestStatus === 'all' || request.status === requestStatus;
    return matchesType && matchesStatus;
  });
  
  // Handle request actions
  const handleApproveRequest = (request) => {
    alert(`Request from ${request.name} approved!`);
    setSelectedRequest(null);
    // In a real app, you would update the state or call an API
  };
  
  const handleRejectRequest = (request) => {
    alert(`Request from ${request.name} rejected!`);
    setSelectedRequest(null);
    // In a real app, you would update the state or call an API
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
                
                <div className="relative">
                  <select
                    className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={requestStatus}
                    onChange={(e) => setRequestStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
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