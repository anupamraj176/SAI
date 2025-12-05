import { useOrderStore } from "../../store/orderStore";
import { ShoppingBag } from "lucide-react";

const SellerOrders = () => {
    const { orders, updateOrderStatus } = useOrderStore();

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Your Orders</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-md border border-[#FFD9A0] overflow-hidden">
                            <div className="bg-[#FDF6E9] px-6 py-4 border-b border-[#FFD9A0] flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-[#8C2F2B] uppercase font-bold">Order ID: {order._id}</p>
                                    <p className="text-sm text-[#2B2B2B]">Buyer: <span className="font-bold">{order.buyer?.name}</span></p>
                                </div>
                                <select 
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    className="px-3 py-1 rounded-lg text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="p-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <img src={item.product?.image} className="w-10 h-10 bg-gray-100 rounded object-cover" />
                                            <div>
                                                <p className="font-medium text-[#2B2B2B]">{item.product?.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-[#8C2F2B]">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <p className="text-lg font-bold text-[#C24C30]">Total: ₹{order.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-40" />
                    <p className="text-lg">No orders received yet.</p>
                </div>
            )}
        </div>
    );
};
export default SellerOrders;