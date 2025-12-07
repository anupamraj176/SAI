import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProducts from "../components/seller/SellerProducts";
import SellerOrders from "../components/seller/SellerOrders";
import CropSenseAI from "../components/seller/CropSenseAI"; // <--- 1. IMPORT THIS
import { LayoutDashboard, DollarSign, Package, TrendingUp } from "lucide-react";

const SellerDashboard = () => {
    const { logout, user } = useAuthStore();
    const { products, fetchSellerProducts } = useProductStore();
    const { orders, fetchSellerOrders } = useOrderStore();
    
    const [activeSection, setActiveSection] = useState("dashboard");

    useEffect(() => {
        fetchSellerProducts();
        fetchSellerOrders();
    }, [fetchSellerProducts, fetchSellerOrders]);

    // Calculate Stats
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans">
            <SellerSidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                onLogout={logout} 
            />

            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]">
                {activeSection === "dashboard" && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-[#8C2F2B]">Seller Dashboard</h1>
                        <p className="text-[#C24C30]">Welcome back, {user?.name}!</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-[#FFD9A0] flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Sales</p>
                                    <p className="text-2xl font-bold text-[#2B2B2B]">₹{totalSales}</p>
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
                    </div>
                )}

                {activeSection === "products" && <SellerProducts />}
                {activeSection === "orders" && <SellerOrders />}
                
                {activeSection === "ai" && <CropSenseAI />}
            </main>
        </div>
    );
};

export default SellerDashboard;