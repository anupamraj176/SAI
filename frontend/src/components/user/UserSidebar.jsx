import { 
    ShoppingBag, 
    ShoppingCart, 
    LayoutDashboard, 
    LogOut, 
    Sparkles, 
    HelpCircle, 
    Heart,
    X
} from "lucide-react";

const UserSidebar = ({ activeSection, setActiveSection, onLogout, user, cartCount, isOpen, onClose }) => {
    
    const SidebarItem = ({ id, icon: Icon, label }) => {
        const isActive = activeSection === id;

        return (
            <button
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                        ? "bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-white shadow-md scale-[1.02]"
                        : "text-[#EEDFCC] hover:bg-[#3A3A3A] hover:text-white"
                    }
                `}
            >
                <Icon size={20} />
                <span>{label}</span>

                {/* Cart badge */}
                {id === "cart" && cartCount > 0 && (
                    <span className="ml-auto bg-[#FF8C42] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cartCount}
                    </span>
                )}
            </button>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:relative z-50 
                w-64 bg-[#2B2B2B] text-white h-screen flex flex-col border-r border-[#403A34] shadow-xl
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                
                {/* HEADER */}
                <div className="p-6 border-b border-[#403A34] flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-[#FFB444]" />
                        <span className="bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-transparent bg-clip-text">
                            FarmerHub
                        </span>
                    </h2>
                    {/* Close Button (Mobile Only) */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* MENU ITEMS */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <SidebarItem id="market" icon={ShoppingBag} label="Marketplace" />
                    <SidebarItem id="cart" icon={ShoppingCart} label="My Cart" />
                    <SidebarItem id="wishlist" icon={Heart} label="Wishlist" />
                    <SidebarItem id="orders" icon={LayoutDashboard} label="My Orders" />
                    <SidebarItem id="support" icon={HelpCircle} label="Support" />
                </nav>

                {/* FOOTER SECTION */}
                <div className="p-4 border-t border-[#403A34]">
                    
                    {/* USER INFO */}
                    <div className="mb-4 px-4 py-2 bg-[#3A3A3A] rounded-lg">
                        <p className="text-xs text-[#FFD9A0] opacity-80">Logged in as</p>
                        <p className="text-sm font-bold text-white truncate">
                            {user?.name}
                        </p>
                    </div>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition 
                                   hover:bg-[#3A3A3A] text-red-400 hover:text-red-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;
