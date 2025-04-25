// Card component for petrol pumps
import { MapPin, Users } from "lucide-react";

const PetrolPumpCard = ({ pump, onClick }) => {
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) return "Just now";
    if (diffHrs === 1) return "1 hour ago";
    if (diffHrs < 24) return `${diffHrs} hours ago`;

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(pump)}
    >
      <div className="relative h-40 bg-gray-200">
        <img
          src={pump.image}
          alt={pump.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
          Active
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{pump.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm truncate">{pump.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users size={16} className="mr-1" />
          <span className="text-sm">
            {pump.totalDeliveryBoys} Delivery Staff
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <span>Last active</span>
          <span>{timeAgo(pump.lastActive)}</span>
        </div>
      </div>
    </div>
  );
};

export default PetrolPumpCard;