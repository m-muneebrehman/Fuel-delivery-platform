// Card component for requests
import { MapPin, Check, X, Eye } from "lucide-react"

const RequestCard = ({ request, onApprove, onReject, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            request.type === 'petrol_pump' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {request.type === 'petrol_pump' ? 'Petrol Pump' : 'Delivery Staff'}
          </span>
          <h4 className="font-medium mt-1">{request.name}</h4>
        </div>
        <span className="text-sm text-gray-500">{formatDate(request.requestDate)}</span>
      </div>
      
      {request.type === 'petrol_pump' ? (
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{request.location}</span>
        </div>
      ) : (
        <div className="text-sm text-gray-600 mb-3">
          Requested by: {request.petrolPump}
        </div>
      )}
      
      <div className="text-sm mb-3">
        <span className="text-gray-600">Documents: </span>
        {request.documents.map((doc, idx) => (
          <span key={idx} className="mr-2 text-blue-600 hover:underline cursor-pointer">
            {doc}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between mt-2">
        <button 
          onClick={() => onView(request)}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <Eye size={16} className="mr-1" />
          <span>View Details</span>
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onReject(request)}
            className="flex items-center justify-center p-2 border border-red-200 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            aria-label="Reject"
          >
            <X size={16} />
          </button>
          <button 
            onClick={() => onApprove(request)}
            className="flex items-center justify-center p-2 border border-green-200 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
            aria-label="Approve"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;