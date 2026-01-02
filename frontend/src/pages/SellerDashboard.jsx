import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react"; // Import Menu icon

import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";

import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProducts from "../components/seller/SellerProducts";
import SellerOrders from "../components/seller/SellerOrders";
import CropSenseAI from "../components/seller/CropSenseAI";
import SellerOverview from "../components/seller/SellerOverview";
import SellerProfile from "../components/seller/SellerProfile";

const SellerDashboard = () => {
    const { logout, user } = useAuthStore();
    const { products, fetchSellerProducts } = useProductStore();
    const { orders, fetchSellerOrders } = useOrderStore();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

    // Centralized Data Fetching
    useEffect(() => {
        const loadData = () => {
            fetchSellerProducts();
            fetchSellerOrders();
        };

        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [fetchSellerProducts, fetchSellerOrders]);

    return (
        <div className="flex h-screen bg-[#E8F5E9] font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1F3326] text-white p-4 z-40 flex items-center justify-between shadow-md">
                <span className="font-bold text-lg bg-gradient-to-r from-[#6FA99F] to-[#CFF56E] text-transparent bg-clip-text">
                    FarmerHub
                </span>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                    <Menu size={24} />
                </button>
            </div>

            <SellerSidebar
                activeSection={activeTab}
                setActiveSection={(section) => {
                    setActiveTab(section);
                    setIsSidebarOpen(false);
                }}
                onLogout={logout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto relative z-0 mt-16 md:mt-0">
                <div className="p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "dashboard" && (
                                <SellerOverview 
                                    user={user}
                                    orders={orders} 
                                    products={products} 
                                    setActiveTab={setActiveTab}
                                />
                            )}
                            {activeTab === "products" && <SellerProducts />}
                            {activeTab === "orders" && <SellerOrders />}
                            {activeTab === "ai" && <CropSenseAI />}
                            {activeTab === "profile" && <SellerProfile />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
};



export default SellerDashboard;
