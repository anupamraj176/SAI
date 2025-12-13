import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import SupportSection from "../components/SupportSection"; // Import
import { Menu } from "lucide-react"; // Import Menu icon

// Import Components
import UserSidebar from "../components/user/UserSidebar";
import UserMarketplace from "../components/user/UserMarketplace";
import UserCart from "../components/user/UserCart";
import UserOrders from "../components/user/UserOrders";
import UserWishlist from "../components/user/UserWishlist";

const UserDashboard = () => {
    const { logout, user } = useAuthStore();
    const { fetchAllProducts } = useProductStore(); 
    const { cart } = useCartStore();
    const { fetchUserOrders } = useOrderStore();
    
    const [activeSection, setActiveSection] = useState("market");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

    useEffect(() => {
        if (activeSection === "market") fetchAllProducts(); 
        if (activeSection === "orders") fetchUserOrders();
    }, [activeSection, fetchAllProducts, fetchUserOrders]);

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[#2B2B2B] text-white p-4 z-40 flex items-center justify-between shadow-md">
                <span className="font-bold text-lg bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-transparent bg-clip-text">
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

            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FDF6E9] mt-16 md:mt-0">
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
