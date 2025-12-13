import { motion } from "framer-motion";
import { Package, Clock, CheckCircle } from "lucide-react";
import { useOrderStore } from "../../store/orderStore";

const UserOrders = ({ setActiveSection }) => {
    const { orders } = useOrderStore();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">My Orders</h1>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl overflow-hidden shadow-md border border-[#FFD9A0]
                                       bg-gradient-to-br from-[#FFF4E6] to-[#FFE9D3] transition"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 bg-[#FFF4E6] border-b border-[#FFD9A0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold text-[#C24C30] uppercase tracking-wide">Order ID</p>
                                    <p className="text-sm font-mono text-[#2B2B2B] break-all">{order._id}</p>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    {order.status === "Pending" ? (
                                        <Clock size={16} className="text-[#E66A32]" />
                                    ) : (
                                        <CheckCircle size={16} className="text-green-600" />
                                    )}

                                    <span
                                        className={`text-sm font-bold px-3 py-1 rounded-full border ${
                                            order.status === "Pending"
                                                ? "text-[#E66A32] bg-[#FFE2C6] border-[#FFB98A]"
                                                : "text-green-700 bg-green-100 border-green-300"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 p-3 rounded-lg shadow-sm border border-[#FFE1BA] gap-4"
                                        >
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-12 h-12 bg-[#FDF6E9] rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product?.image && (
                                                        <img
                                                            src={item.product.image}
                                                            alt="Product"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-[#2B2B2B] line-clamp-1">
                                                        {item.product?.name || "Unknown Product"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>

                                            <p className="font-bold text-[#8C2F2B] self-end sm:self-auto">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center pt-4 border-t border-[#FFE1BA]">
                                    <p className="text-sm text-gray-600">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>

                                    <p className="text-xl font-bold text-[#C24C30]">
                                        Total: ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#C24C30]/60">
                    <Package className="w-16 h-16 mb-4 opacity-40" />
                    <p className="text-lg">You haven't placed any orders yet.</p>
                    <button
                        onClick={() => setActiveSection("market")}
                        className="mt-4 text-[#E66A32] hover:text-[#C24C30] hover:underline font-medium"
                    >
                        Browse Market
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
