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
                            className="bg-white rounded-xl shadow-sm border border-[#FFD9A0] overflow-hidden"
                        >
                            <div className="bg-[#FDF6E9] px-6 py-4 border-b border-[#FFD9A0] flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-[#8C2F2B] uppercase font-bold">Order ID</p>
                                    <p className="text-sm font-mono text-[#2B2B2B]">{order._id}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {order.status === 'Pending' ? <Clock size={16} className="text-orange-500"/> : <CheckCircle size={16} className="text-green-500"/>}
                                    <span className={`text-sm font-bold ${order.status === 'Pending' ? 'text-orange-500' : 'text-green-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                    {item.product?.image && <img src={item.product.image} alt="Product" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#2B2B2B]">{item.product?.name || "Unknown Product"}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-[#8C2F2B]">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xl font-bold text-[#C24C30]">Total: ₹{order.totalAmount}</p>
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
                        className="mt-4 text-[#FF8C42] hover:underline font-medium"
                    >
                        Browse Market
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserOrders;