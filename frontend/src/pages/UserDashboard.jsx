import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore"; // Import Order Store
import toast from "react-hot-toast";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    LogOut, 
    Search,
    Plus,
    Minus,
    Trash2,
    Sparkles,
    Package,
    CheckCircle,
    Clock
} from "lucide-react";

const UserDashboard = () => {
    const { logout, user } = useAuthStore();
    const { products, isLoading, fetchAllProducts } = useProductStore(); 
    const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
    const { createOrder, fetchUserOrders, orders, isLoading: isOrderLoading } = useOrderStore(); // Use Order Store
    
    const [activeSection, setActiveSection] = useState("market");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (activeSection === "market") {
            fetchAllProducts(); 
        }
        if (activeSection === "orders") {
            fetchUserOrders();
        }
    }, [activeSection, fetchAllProducts, fetchUserOrders]);

    const handleLogout = () => {
        logout();
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        const total = getCartTotal(cart);
        const result = await createOrder(cart, total);
        
        if (result.success) {
            toast.success("Order placed successfully!");
            clearCart();
            setActiveSection("orders");
        } else {
            toast.error(result.message);
        }
    };

    const filteredProducts = products?.filter(product => {
        const name = product.name?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        
        return name.includes(search) || category.includes(search);
    }) || [];

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                activeSection === id 
                ? "bg-[#C24C30] text-white shadow-lg" 
                : "text-[#FFD9A0] hover:bg-[#2B2B2B] hover:text-white"
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
            {id === 'cart' && cart.length > 0 && (
                <span className="ml-auto bg-[#FF8C42] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cart.length}
                </span>
            )}
        </button>
    );

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans">
            
            {/* Sidebar */}
            <aside className="w-64 bg-[#1A1A1A] border-r border-[#2B2B2B] flex flex-col shadow-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#FF8C42] mb-8 flex items-center gap-2">
                        <Sparkles className="text-[#FF8C42]" /> FarmerHub
                    </h2>
                    
                    <nav className="space-y-1">
                        <SidebarItem id="market" icon={ShoppingBag} label="Marketplace" />
                        <SidebarItem id="cart" icon={ShoppingCart} label="My Cart" />
                        <SidebarItem id="orders" icon={LayoutDashboard} label="My Orders" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-[#2B2B2B]">
                    <div className="mb-4 px-4 py-2 bg-[#2B2B2B] rounded-lg">
                        <p className="text-xs text-[#FFD9A0]">Logged in as</p>
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[#8C2F2B] hover:bg-[#2B2B2B] hover:text-[#FF8C42] rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]">
                
                {/* Marketplace Section */}
                {activeSection === "market" && (
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <h1 className="text-3xl font-bold text-[#8C2F2B]">Fresh Produce Market</h1>
                            
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search for fruits, vegetables..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#FFD9A0] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md border border-[#FFD9A0] flex flex-col group hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden bg-[#FDF6E9]">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2 bg-[#2B2B2B]/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-[#FFD9A0] font-bold shadow-sm">
                                            {product.category}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-[#2B2B2B] mb-1">{product.name}</h3>
                                        <p className="text-[#8C2F2B]/80 text-xs mb-3 line-clamp-2">{product.description}</p>
                                        
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-lg font-bold text-[#C24C30]">₹{product.price}</span>
                                            <button 
                                                onClick={() => {
                                                    addToCart(product);
                                                    toast.success("Added to cart");
                                                }}
                                                className="bg-[#FF8C42] hover:bg-[#E66A32] text-white p-2 rounded-lg transition-colors shadow-sm"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {filteredProducts.length === 0 && !isLoading && (
                            <div className="text-center py-20 text-[#C24C30]/50">
                                <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
                                <p className="text-lg">No products found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Cart Section */}
                {activeSection === "cart" && (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Your Cart</h1>
                        
                        {cart.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    {cart.map((item) => (
                                        <motion.div 
                                            key={item._id}
                                            layout
                                            className="bg-white p-4 rounded-xl shadow-sm border border-[#FFD9A0] flex gap-4 items-center"
                                        >
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                            
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#2B2B2B]">{item.name}</h3>
                                                <p className="text-sm text-[#8C2F2B]">₹{item.price} / unit</p>
                                            </div>

                                            <div className="flex items-center gap-3 bg-[#FDF6E9] rounded-lg p-1">
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="p-1 hover:bg-[#FFD9A0] rounded transition"
                                                >
                                                    <Minus size={16} className="text-[#C24C30]" />
                                                </button>
                                                <span className="font-bold text-[#2B2B2B] w-4 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="p-1 hover:bg-[#FFD9A0] rounded transition"
                                                >
                                                    <Plus size={16} className="text-[#C24C30]" />
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-2 text-gray-400 hover:text-[#8C2F2B] transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0] sticky top-4">
                                        <h3 className="text-xl font-bold text-[#2B2B2B] mb-4">Order Summary</h3>
                                        
                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>₹{getCartTotal(cart)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="text-green-600">Free</span>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-4 mb-6">
                                            <div className="flex justify-between font-bold text-lg text-[#C24C30]">
                                                <span>Total</span>
                                                <span>₹{getCartTotal(cart)}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleCheckout}
                                            disabled={isOrderLoading}
                                            className="w-full bg-[#C24C30] hover:bg-[#A03B23] text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-50"
                                        >
                                            {isOrderLoading ? "Processing..." : "Proceed to Checkout"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-[#C24C30]/50">
                                <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-40" />
                                <p className="text-xl font-medium">Your cart is empty</p>
                                <button 
                                    onClick={() => setActiveSection("market")}
                                    className="mt-4 text-[#FF8C42] hover:underline font-medium"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Section */}
                {activeSection === "orders" && (
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
                )}

            </main>
        </div>
    );
};

export default UserDashboard;
