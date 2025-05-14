// File: components/EmptyState.jsx
import React from "react";
import { User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyState = ({ searchTerm, onAddClick }) => {
  return (
    <div className="text-center py-12">
      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
        <User className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No delivery staff found</h3>
      {searchTerm ? (
        <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms or clear the search.</p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Get started by adding a new delivery staff member.</p>
      )}
      <div className="mt-6">
        <Button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
    </div>
  );
};