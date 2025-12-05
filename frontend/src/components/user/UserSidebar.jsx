import { ShoppingBag, ShoppingCart, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

const UserSidebar = ({ activeSection, setActiveSection, onLogout, user, cartCount }) => {
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
            {id === 'cart' && cartCount > 0 && (
                <span className="ml-auto bg-[#FF8C42] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                </span>
            )}
        </button>
    );

    return (
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
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#8C2F2B] hover:bg-[#2B2B2B] hover:text-[#FF8C42] rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;