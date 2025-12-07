import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProducts from "../components/seller/SellerProducts";
import SellerOrders from "../components/seller/SellerOrders";
import CropSenseAI from "../components/seller/CropSenseAI";
import { DollarSign, Package, TrendingUp, Activity } from "lucide-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const SellerDashboard = () => {
    const { logout, user } = useAuthStore();
    const { products, fetchSellerProducts } = useProductStore();
    const { orders, fetchSellerOrders } = useOrderStore();
    
    // Using activeTab state
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        // Initial fetch
        fetchSellerProducts();
        fetchSellerOrders();

        // Real-time polling every 10 seconds
        const interval = setInterval(() => {
            fetchSellerProducts();
            fetchSellerOrders();
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchSellerProducts, fetchSellerOrders]);

    // Calculate Stats safely
    const totalSales = orders?.reduce((acc, order) => {
        // Only count revenue if the order is delivered (case-insensitive check)
        if (order.status?.toLowerCase() === 'delivered') {
            return acc + order.totalAmount;
        }
        return acc;
    }, 0) || 0;
    
    const totalOrders = orders?.length || 0;
    const totalProducts = products?.length || 0;

    // Prepare Chart Data
    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        // Group orders by date
        const groupedData = orders.reduce((acc, order) => {
            const dateObj = new Date(order.createdAt);
            // Skip invalid dates
            if (isNaN(dateObj.getTime())) return acc;

            const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (!acc[date]) {
                acc[date] = { 
                    name: date, 
                    sales: 0, 
                    orders: 0,
                    rawDate: dateObj // Store for sorting
                };
            }
            
            // Only chart revenue for delivered items (case-insensitive)
            if (order.status?.toLowerCase() === 'delivered') {
                acc[date].sales += order.totalAmount;
            }
            
            acc[date].orders += 1;
            
            return acc;
        }, {});

        // Sort data chronologically
        return Object.values(groupedData).sort((a, b) => a.rawDate - b.rawDate);
    }, [orders]);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div>
                            <h1 className="text-3xl font-bold text-[#8C2F2B]">Seller Dashboard</h1>
                            <p className="text-[#C24C30]">Welcome back, {user?.name}!</p>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0] flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold text-[#2B2B2B]">₹{totalSales.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0] flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Products</p>
                                    <p className="text-2xl font-bold text-[#2B2B2B]">{totalProducts}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0] flex items-center gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Orders</p>
                                    <p className="text-2xl font-bold text-[#2B2B2B]">{totalOrders}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Revenue Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-[#2B2B2B]">Revenue Overview</h3>
                                    <Activity size={20} className="text-green-500" />
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="sales" 
                                                stroke="#10B981" 
                                                strokeWidth={2}
                                                fillOpacity={1} 
                                                fill="url(#colorSales)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Orders Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-[#2B2B2B]">Orders Volume</h3>
                                    <TrendingUp size={20} className="text-orange-500" />
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                            <Tooltip 
                                                cursor={{fill: 'transparent'}}
                                                contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "products":
                return <SellerProducts />;
            case "orders":
                return <SellerOrders />;
            case "ai":
                return <CropSenseAI />;
            default:
                return <SellerProducts />;
        }
    };

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans">
            <SellerSidebar 
                activeSection={activeTab} 
                setActiveSection={setActiveTab} 
                onLogout={logout} 
            />

            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SellerDashboard;