// File: ConfirmDeleteModal.jsx
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({ id, onCancel, onConfirm, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this delivery staff member? This action cannot be undone.
            </p>
            
            <div className="flex w-full space-x-4">
              <Button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                onClick={() => onConfirm(id)}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}