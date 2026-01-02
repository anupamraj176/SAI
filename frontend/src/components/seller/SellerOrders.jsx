import { useOrderStore } from "../../store/orderStore";
import { ShoppingBag } from "lucide-react";

const SellerOrders = () => {
    const { orders, updateOrderStatus } = useOrderStore();

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-[#1F3326] mb-8">Your Orders</h1>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div 
                            key={order._id} 
                            className="bg-[#E8F5E9] rounded-2xl shadow-md border border-[#6FA99F] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-[#C8E6C9] px-6 py-4 border-b border-[#6FA99F] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-xs text-[#1F3326] uppercase font-bold">
                                        Order ID: {order._id}
                                    </p>
                                    <p className="text-sm text-[#1F3326]">
                                        Buyer: <span className="font-bold">{order.buyer?.name}</span>
                                    </p>
                                </div>

                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    className="
                                        w-full sm:w-auto
                                        px-3 py-1 rounded-lg text-sm font-bold border border-[#6FA99F]
                                        bg-[#E8F5E9] text-[#1F3326]
                                        focus:outline-none focus:ring-2 focus:ring-[#347B66]
                                    "
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Items */}
                            <div className="p-6">
                                {order.items.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2"
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <img 
                                                src={item.product?.image} 
                                                className="w-12 h-12 bg-[#C8E6C9] rounded-lg object-cover border border-[#6FA99F] flex-shrink-0" 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[#1F3326] truncate">
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-xs text-[#3B4A38]/60">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="font-bold text-[#347B66] self-end sm:self-auto">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}

                                {/* Total */}
                                <div className="mt-4 pt-4 border-t border-[#6FA99F] flex justify-end">
                                    <p className="text-lg font-bold text-[#347B66]">
                                        Total: ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#3B4A38]/60">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-40" />
                    <p className="text-lg">No orders received yet.</p>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
