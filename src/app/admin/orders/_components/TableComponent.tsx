"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber, formatTextToUpperCase, formatFullName, formatDate } from "@/lib/formatters";
import { Plus, Minus, ReceiptTextIcon } from "lucide-react";
import { ExtendedOrder } from "@/lib/types";
import InvoiceModal from './InvoiceModal'; // Yeni modal bileşenini içe aktarın.

interface TableComponentProps {
  orders: ExtendedOrder[];
}

const TableComponent: React.FC<TableComponentProps> = ({ orders }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const openInvoiceModal = (order: ExtendedOrder) => {
    setSelectedOrder(order);
  };

  const closeInvoiceModal = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <Table className="min-w-full bg-white shadow-md rounded-lg">
        <TableHeader className="bg-blue-100 text-gray-800">
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-left">Sipariş No</TableHead>
            <TableHead className="text-left">Müşteri</TableHead>
            <TableHead className="text-left">Toplam Tutar</TableHead>
            <TableHead className="text-left">Ürün Sayısı</TableHead>
            <TableHead className="text-left">Sipariş Tarihi</TableHead>
            <TableHead className="text-left">Fatura</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <TableRow className="hover:bg-gray-100">
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => toggleRow(order.id)}
                    className="p-2"
                  >
                    {expandedRow === order.id ? <Minus size={16} /> : <Plus size={16} />}
                  </Button>
                </TableCell>
                <TableCell>
                  {formatTextToUpperCase(order.orderNumber)}
                </TableCell>
                <TableCell>
                  {formatFullName(order.billingInfo.firstName, order.billingInfo.lastName)}
                </TableCell>
                <TableCell>
                  {formatCurrency(order.totalPriceInCents)}
                </TableCell>
                <TableCell>
                  {formatNumber(order.items.length)}
                </TableCell>
                <TableCell>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => openInvoiceModal(order)} // Fatura bilgilerini açmak için
                    className="p-2"
                  >
                    <ReceiptTextIcon size={20} />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === order.id && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Table className="bg-gray-50">
                      <TableHeader className="bg-blue-200 text-gray-800">
                        <TableRow>
                          <TableHead>Ürün Adı</TableHead>
                          <TableHead>Miktar</TableHead>
                          <TableHead>Fiyat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.length > 0 ? (
                          order.items.map(item => (
                            <TableRow key={item.id}>
                              <TableCell>
                                {item.product ? item.product.name : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {item.quantity}
                              </TableCell>
                              <TableCell>
                                {item.product ? formatCurrency(item.product.priceInCents) : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3}>No items available</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <InvoiceModal
          isOpen={!!selectedOrder}
          onClose={closeInvoiceModal}
          billingInfo={selectedOrder.billingInfo} // Fatura bilgilerini modal bileşenine geçiyoruz
        />
      )}
    </>
  );
}

export default TableComponent;
