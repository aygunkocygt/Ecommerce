import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"; // Diyalog bileşenlerini içeren UI kitaplığından bileşenler.

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  billingInfo: {
    firstName: string;
    lastName: string;
    companyName: string;
    taxOrIdNumber?: string | null;
    billingAddress: string;
    apartment: string;
    city: string;
    district: string;
    shippingAddress?: string | null;
    phone: string;
    email: string;
  };
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, billingInfo }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fatura Bilgileri</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <div className="flex flex-col space-y-1 p-0">
          <span className='text-sm'><strong>İsim:</strong> {billingInfo.firstName} {billingInfo.lastName}</span>
          <span className='text-sm'><strong>Şirket Adı:</strong> {billingInfo.companyName}</span>
          <span className='text-sm'><strong>Vergi/ID Numarası:</strong> {billingInfo.taxOrIdNumber}</span>
          <span className='text-sm'><strong>Fatura Adresi:</strong> {billingInfo.billingAddress}, {billingInfo.apartment}, {billingInfo.city}, {billingInfo.district}</span>
          <span className='text-sm'><strong>Teslimat Adresi:</strong> {billingInfo.shippingAddress}, {billingInfo.apartment}, {billingInfo.city}, {billingInfo.district}</span>
          <span className='text-sm'><strong>Telefon:</strong> {billingInfo.phone}</span>
          <span className='text-sm'><strong>Email:</strong> {billingInfo.email}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
