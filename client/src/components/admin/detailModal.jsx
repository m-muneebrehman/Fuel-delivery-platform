// Detailed modal component
import { MapPin, Users, X } from "lucide-react";

const DetailModal = ({ pump, onClose }) => {
  if (!pump) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{pump.name}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <img 
              src={pump.image} 
              alt={pump.name} 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-gray-400" />
                <p>{pump.location}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Staff</h3>
              <div className="flex items-start">
                <Users size={18} className="mr-2 mt-1 text-gray-400" />
                <p>{pump.totalDeliveryBoys} active staff members</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Delivery Staff List</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(Math.min(5, pump.totalDeliveryBoys))].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">{String.fromCharCode(65 + idx)}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">Staff Member {idx + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(Math.random() * 50) + 10}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;