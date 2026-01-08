"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Phone, MessageSquare, X } from "lucide-react";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  phone: string;
}

export default function ContactDialog({ isOpen, onClose, name, phone }: ContactDialogProps) {
  const handleSMS = () => {
    const message = `Hello ${name}, there is an urgent blood donation requirement. Are you available to help?`;
    const url = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl z-[101] p-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Notify {name}
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>

          <p className="text-gray-600 mb-8">
            Click below to send an SMS notification to the donor. This will open your default messaging app.
          </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleSMS}
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors group w-full text-left"
              >
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-900 text-lg">Notify via SMS</span>
                  <span className="block text-sm text-gray-500">Send an urgent donation request</span>
                </div>
              </button>
            </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <Dialog.Close className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              Cancel
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
