import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";

import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProducts from "../components/seller/SellerProducts";
import SellerOrders from "../components/seller/SellerOrders";
import CropSenseAI from "../components/seller/CropSenseAI";
import SellerOverview from "../components/seller/SellerOverview";

const SellerDashboard = () => {
    const { logout, user } = useAuthStore();
    const { products, fetchSellerProducts } = useProductStore();
    const { orders, fetchSellerOrders } = useOrderStore();

    const [activeTab, setActiveTab] = useState("dashboard");

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
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <SellerSidebar
                activeSection={activeTab}
                setActiveSection={setActiveTab}
                onLogout={logout}
            />

            <main className="flex-1 overflow-y-auto relative z-0">
                {/* Static Background */}
                <div className="absolute inset-0 bg-gray-50 -z-10" />

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
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
};



export default SellerDashboard;
