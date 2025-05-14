// File: DetailsModal.jsx
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DetailsModal({
  boy,
  onClose,
  onToggleStatus,
  onConfirmDelete,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header with Photo */}
        <div className="flex flex-col items-center pt-8 pb-4 border-b border-gray-100">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={boy.photo}
                alt={boy.fullName}
                className="h-full w-full object-cover"
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white ${
                boy.status === "available" ? "bg-green-500" : "bg-orange-500"
              }`}
            ></span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {boy.fullName}
          </h2>
          <div className="flex items-center mt-2">
            {boy.isVerified ? (
              <div className="flex items-center text-green-600">
                <ShieldCheck size={16} className="mr-1" />
                <span>Verified Staff</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <ShieldAlert size={16} className="mr-1" />
                <span>Unverified Staff</span>
              </div>
            )}
          </div>
          <div
            className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              boy.status === "available"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {boy.status === "available" ? "Available" : "Busy"}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Staff Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-start">
              <Mail className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Email Address
                </p>
                <p className="text-gray-800">{boy.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Phone Number
                </p>
                <p className="text-gray-800">{boy.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">CNIC Number</p>
                <p className="text-gray-800">{boy.cnicNumber}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-800">{boy.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Building className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              type="button"
              onClick={() => onToggleStatus(boy._id, boy.status)}
              className={`w-full ${
                boy.status === "available"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white flex items-center justify-center`}
            >
              {boy.status === "available" ? (
                <>
                  <Clock size={16} className="mr-2" />
                  Mark as Busy
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Mark as Available
                </>
              )}
            </Button>

            {/* Delete Button */}
            <Button
              type="button"
              onClick={() => {
                onClose();
                onConfirmDelete(boy._id);
              }}
              className="w-full mt-2 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center border border-red-100"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Staff Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
