import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import LoadingSpinner from "../LoadingSpinner";

// Green color palette
const PALETTE = {
  emerald: "#347B66",
  lime: "#CFF56E",
  forest: "#3B4A38",
  evergreen: "#1F3326",
  sage: "#6FA99F",
};

const AdminOrders = () => {
  const { orders, fetchOrders, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8 bg-[#E8F5E9]">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-10 bg-[#E8F5E9]">
        <h2 className="text-3xl font-bold text-[#1F3326] mb-6">
          Manage Orders
        </h2>

        <div className="bg-[#E8F5E9] p-10 rounded-2xl border border-[#6FA99F] text-center text-[#1F3326] shadow-md">
          No orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#E8F5E9] min-h-screen">
      <h2 className="text-3xl font-bold text-[#1F3326] mb-8">
        Manage Orders
      </h2>

      <div className="hidden md:block bg-[#E8F5E9] rounded-2xl shadow-xl border border-[#6FA99F] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#C8E6C9] border-b border-[#6FA99F]">
            <tr>
              <th className="p-4 font-semibold text-[#1F3326]">Order ID</th>
              <th className="p-4 font-semibold text-[#1F3326]">Customer</th>
              <th className="p-4 font-semibold text-[#1F3326]">Total</th>
              <th className="p-4 font-semibold text-[#1F3326]">Status</th>
              <th className="p-4 font-semibold text-[#1F3326]">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#6FA99F]">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-[#C8E6C9] transition"
              >
                <td className="p-4 font-mono text-sm text-[#3B4A38]">
                  #{order._id.slice(-6)}
                </td>

                <td className="p-4 text-[#1F3326] font-medium">
                  {order.buyer?.name || "Unknown"}
                </td>

                <td className="p-4 font-bold text-[#1F3326]">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4 text-[#3B4A38] text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-8 text-center text-[#1F3326]">
            No orders found.
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div 
            key={order._id}
            className="bg-[#E8F5E9] p-4 rounded-xl shadow-md border border-[#6FA99F] space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#3B4A38] uppercase">Order ID</p>
                <p className="font-mono text-sm text-[#1F3326]">#{order._id.slice(-6)}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-[#3B4A38] uppercase">Customer</p>
                <p className="text-sm text-[#1F3326] font-medium">{order.buyer?.name || "Unknown"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#3B4A38] uppercase">Total</p>
                <p className="text-lg font-bold text-[#347B66]">₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#6FA99F]/50 text-xs text-[#3B4A38]">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="p-8 text-center text-[#1F3326] bg-[#E8F5E9] rounded-xl border border-[#6FA99F]">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
