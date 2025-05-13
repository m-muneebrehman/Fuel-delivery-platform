// File: components/DeliveryBoyCard.jsx
import React from "react";
import { User, Mail, Phone, Building, Trash2 } from "lucide-react";

export const DeliveryBoyCard = ({ boy, onShowDetails, onConfirmDelete }) => {
  return (
    <div
      onClick={() => onShowDetails(boy._id)}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className={`h-2 w-full ${
        boy.status === "available" 
          ? "bg-gradient-to-r from-green-400 to-green-500" 
          : "bg-gradient-to-r from-orange-400 to-orange-500"
      }`}></div>
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {boy.photo ? (
            <img
              src={boy.photo}
              alt={boy.fullName}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center border-2 border-gray-100 shadow-sm">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{boy.fullName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Mail className="h-3 w-3 mr-1" />
              <span>{boy.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-3 w-3 mr-1" />
            <span>{boy.phoneNumber}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              boy.status === "available"
                ? "bg-green-50 text-green-700"
                : "bg-orange-50 text-orange-700"
            }`}>
              {boy.status === "available" ? "Available" : "Busy"}
            </span>
            
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              boy.isVerified
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-50 text-gray-700"
            }`}>
              {boy.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirmDelete(boy._id);
            }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            aria-label="Delete staff member"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};