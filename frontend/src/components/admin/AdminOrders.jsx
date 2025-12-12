import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ShoppingBag, CheckCircle, Truck, Package } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const AdminOrders = () => {
  const { orders, fetchOrders, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
          No orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Customer</th>
              <th className="p-4 font-semibold text-gray-600">Total</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-500">
                  #{order._id.slice(-6)}
                </td>
                <td className="p-4 text-gray-800 font-medium">
                  {order.buyer?.name || 'Unknown'}
                </td>
                <td className="p-4 font-bold text-gray-800">₹{order.totalAmount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
