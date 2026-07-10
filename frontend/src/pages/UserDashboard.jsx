import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import SupportSection from "../components/features/support/SupportSection"; // Import
import { Menu } from "lucide-react"; // Import Menu icon

// Import Components
import UserSidebar from "../components/layout/UserSidebar";
import UserMarketplace from "../components/features/user/UserMarketplace";
import UserCart from "../components/features/user/UserCart";
import UserOrders from "../components/features/user/UserOrders";
import UserWishlist from "../components/features/user/UserWishlist";

const UserDashboard = () => {
    const { logout, user } = useAuthStore();
    const { fetchAllProducts } = useProductStore(); 
    const { cart } = useCartStore();
    const { fetchUserOrders } = useOrderStore();
    
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");
    const [activeSection, setActiveSection] = useState(sectionParam || "market");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

    useEffect(() => {
        if (sectionParam) {
            setActiveSection(sectionParam);
        }
    }, [sectionParam]);

    useEffect(() => {
        if (activeSection === "market") fetchAllProducts(); 
        if (activeSection === "orders") fetchUserOrders();
    }, [activeSection, fetchAllProducts, fetchUserOrders]);

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

            <UserSidebar 
                activeSection={activeSection} 
                setActiveSection={(section) => {
                    setActiveSection(section);
                    setIsSidebarOpen(false); // Close sidebar on selection (mobile)
                }} 
                onLogout={logout} 
                user={user}
                cartCount={cart.length}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#E8F5E9] mt-16 md:mt-0">
                {activeSection === "market" && <UserMarketplace />}
                {activeSection === "cart" && <UserCart setActiveSection={setActiveSection} />}
                {activeSection === "orders" && <UserOrders />}
                {activeSection === "wishlist" && <UserWishlist />}
                {activeSection === "support" && <SupportSection />}
            </main>
        </div>
    );
};

export default UserDashboard;
