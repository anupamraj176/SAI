import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import LoadingSpinner from "../LoadingSpinner";

// Warm color palette
const PALETTE = {
  paprika: "#E66A32",
  nougat: "#FFF6E9",
  rust: "#C24C30",
  maroon: "#8C2F2B",
  saffron: "#FFB444",
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
      <div className="p-8 bg-[#FAF3E3]">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-10 bg-[#FAF3E3]">
        <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">
          Manage Orders
        </h2>

        <div className="bg-[#FFF6E9] p-10 rounded-2xl border border-[#EAD7BD] text-center text-[#8C2F2B] shadow-md">
          No orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#FAF3E3] min-h-screen">
      <h2 className="text-3xl font-bold text-[#2B2B2B] mb-8">
        Manage Orders
      </h2>

      <div className="hidden md:block bg-[#FFF6E9] rounded-2xl shadow-xl border border-[#EAD7BD] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F3E6D3] border-b border-[#EAD7BD]">
            <tr>
              <th className="p-4 font-semibold text-[#8C2F2B]">Order ID</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Customer</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Total</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Status</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAD7BD]">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-[#F7EDE1] transition"
              >
                <td className="p-4 font-mono text-sm text-[#8C2F2B]">
                  #{order._id.slice(-6)}
                </td>

                <td className="p-4 text-[#2B2B2B] font-medium">
                  {order.buyer?.name || "Unknown"}
                </td>

                <td className="p-4 font-bold text-[#2B2B2B]">
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

                <td className="p-4 text-[#8C2F2B] text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-8 text-center text-[#8C2F2B]">
            No orders found.
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div 
            key={order._id}
            className="bg-[#FFF6E9] p-4 rounded-xl shadow-md border border-[#EAD7BD] space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#8C2F2B] uppercase">Order ID</p>
                <p className="font-mono text-sm text-[#2B2B2B]">#{order._id.slice(-6)}</p>
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
                <p className="text-[10px] font-bold text-[#8C2F2B] uppercase">Customer</p>
                <p className="text-sm text-[#2B2B2B] font-medium">{order.buyer?.name || "Unknown"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#8C2F2B] uppercase">Total</p>
                <p className="text-lg font-bold text-[#C24C30]">₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAD7BD]/50 text-xs text-[#8C2F2B]">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="p-8 text-center text-[#8C2F2B] bg-[#FFF6E9] rounded-xl border border-[#EAD7BD]">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
