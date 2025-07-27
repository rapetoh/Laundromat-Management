import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime, formatPickupDate } from '../utils/formatters';

const Receipt = ({ order }) => {
  const { t } = useTranslation();
  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');

  return (
    <div className="receipt-container bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto print:border-none print:shadow-none">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('receipt.title')}</h1>
        <div className="w-16 h-1 bg-primary-600 mx-auto"></div>
      </div>

      {/* Order Info */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{t('receipt.orderNumber')}:</span>
          <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{t('receipt.date')}:</span>
          <span className="text-sm text-gray-900">{formatDateTime(order.created_at)}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{t('receipt.customer')}:</span>
          <span className="text-sm font-semibold text-gray-900">{order.customer_name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{t('receipt.phone')}:</span>
          <span className="text-sm text-gray-900">{order.customer_phone}</span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('receipt.items')}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">x{item.quantity}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pickup Date */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{t('receipt.pickupDate')}:</span>
          <span className="text-sm font-semibold text-blue-900">{formatPickupDate(order.pickup_date)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">{t('receipt.total')}:</span>
          <span className="text-2xl font-bold text-primary-600">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-2">{t('receipt.thankYou')}</p>
        <p className="text-xs text-gray-500">{t('receipt.printInstructions')}</p>
      </div>
    </div>
  );
};

export default Receipt; 