// Request details modal
const RequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
  if (!request) return null;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mr-3 ${
                request.type === 'petrol_pump' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {request.type === 'petrol_pump' ? 'Petrol Pump' : 'Delivery Staff'}
              </span>
              <h2 className="text-xl font-bold">{request.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Request ID</h3>
                <p>#{request.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Request Date</h3>
                <p>{formatDate(request.requestDate)}</p>
              </div>
            </div>
            
            {request.type === 'petrol_pump' ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <div className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-1 text-gray-400" />
                  <p>{request.location}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Petrol Pump</h3>
                <p>{request.petrolPump}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {request.documents.map((doc, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="bg-gray-100 p-2 rounded mr-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{doc}</p>
                      <p className="text-xs text-gray-500">Click to view document</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
              <p className="text-gray-700">
                {request.type === 'petrol_pump' 
                  ? "This petrol pump is requesting to join our platform. Please review the attached documents to verify their credentials and compliance with safety regulations."
                  : "This delivery person is applying to work with the specified petrol pump. Please review their identity documents and qualifications."}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => onReject(request)}
              className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center"
            >
              <X size={16} className="mr-1" />
              Reject
            </button>
            <button 
              onClick={() => onApprove(request)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Check size={16} className="mr-1" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};