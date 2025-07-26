import React from 'react';
import { formatCurrency, formatDateTime, formatPickupDate } from '../utils/formatters';

const Receipt = ({ order }) => {
  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto print:border-none print:shadow-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold text-2xl">P</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pressia</h1>
        <p className="text-sm text-gray-600">Gestion de Blanchisserie</p>
        <p className="text-xs text-gray-500 mt-1">Reçu de commande</p>
      </div>

      {/* Order Info */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-600">Commande #:</span>
          <span className="text-sm font-medium text-gray-900">{order.id}</span>
        </div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-600">Date:</span>
          <span className="text-sm font-medium text-gray-900">{formatDateTime(order.created_at)}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Nom:</span>
            <span className="text-sm font-medium text-gray-900">{order.customer_name}</span>
          </div>
          {order.customer_phone && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Téléphone:</span>
              <span className="text-sm font-medium text-gray-900">{order.customer_phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Articles</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(item.price)} × {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pickup Date */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Date de récupération:</span>
          <span className="text-sm font-medium text-gray-900">{formatPickupDate(order.pickup_date)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Merci pour votre confiance !
          </p>
          <p className="text-xs text-gray-400">
            Conservez ce reçu pour récupérer vos vêtements
          </p>
          <div className="text-xs text-gray-400 mt-4">
            <p>Pressia - Système de gestion de blanchisserie</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="print:hidden mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Conseil:</strong> Utilisez Ctrl+P (ou Cmd+P sur Mac) pour imprimer ce reçu
        </p>
      </div>
    </div>
  );
};

export default Receipt; 