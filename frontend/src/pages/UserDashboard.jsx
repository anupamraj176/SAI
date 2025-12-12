import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import SupportSection from "../components/SupportSection"; // Import

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

    useEffect(() => {
        if (activeSection === "market") fetchAllProducts(); 
        if (activeSection === "orders") fetchUserOrders();
    }, [activeSection, fetchAllProducts, fetchUserOrders]);

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans">
            <UserSidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                onLogout={logout} 
                user={user}
                cartCount={cart.length}
            />

            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]">
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
