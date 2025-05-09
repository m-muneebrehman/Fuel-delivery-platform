// components/DeleteConfirmationModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg text-red-600 font-semibold">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-3 px-1 bg-red-50 rounded-md">
          <p className="text-gray-700 text-sm">
            Are you sure you want to delete <span className="font-semibold text-red-600">{itemName}</span>? <br />
            <span className="text-gray-500 text-xs">This action is permanent and cannot be undone.</span>
          </p>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            className="hover:bg-gray-100 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
