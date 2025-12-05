import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import { HelpCircle, Sparkles } from "lucide-react";

// Import Components
import SellerSidebar from "../components/seller/SellerSidebar";
import SellerProducts from "../components/seller/SellerProducts";
import SellerOrders from "../components/seller/SellerOrders";
import SupportSection from "../components/SupportSection"; // Import the new component

const SellerDashboard = () => {
    const { logout } = useAuthStore();
    const { fetchSellerProducts } = useProductStore();
    const { fetchSellerOrders } = useOrderStore();
    const [activeSection, setActiveSection] = useState("dashboard");

    useEffect(() => {
        if (activeSection === "products") fetchSellerProducts();
        if (activeSection === "orders") fetchSellerOrders();
    }, [activeSection, fetchSellerProducts, fetchSellerOrders]);

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans">
            <SellerSidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                onLogout={logout} 
            />

            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]">
                {activeSection === "dashboard" && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Visualize Your Sales</h1>
                        <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                            <p className="text-lg">No orders have been placed. Check back soon!</p>
                        </div>
                    </div>
                )}

                {activeSection === "products" && <SellerProducts />}
                
                {activeSection === "orders" && <SellerOrders />}

                {activeSection === "faqs" && <SupportSection />}

                {activeSection === "ai" && (
                    <div className="h-full flex flex-col items-center justify-center text-[#C24C30]/60">
                        <Sparkles className="w-16 h-16 mb-4 opacity-40" />
                        <p className="text-lg">AI insights coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SellerDashboard;