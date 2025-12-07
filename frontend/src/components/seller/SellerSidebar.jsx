import { LayoutDashboard, Package, ShoppingBag, LogOut, Sparkles, Bot } from "lucide-react"; // Import Bot

const SellerSidebar = ({ activeSection, setActiveSection, onLogout }) => {
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
        </button>
    );

    return (
        <aside className="w-64 bg-[#1A1A1A] border-r border-[#2B2B2B] flex flex-col shadow-2xl">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[#FF8C42] mb-8 flex items-center gap-2">
                    <Sparkles className="text-[#FF8C42]" /> FarmerHub
                </h2>
                <nav className="space-y-1">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="products" icon={Package} label="My Products" />
                    <SidebarItem id="orders" icon={ShoppingBag} label="Orders" />
                    <SidebarItem id="ai" icon={Bot} label="CropSense AI" /> {/* Add this line */}
                </nav>
            </div>
            <div className="mt-auto p-6 border-t border-[#2B2B2B]">
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#8C2F2B] hover:bg-[#2B2B2B] hover:text-[#FF8C42] rounded-lg transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
export default SellerSidebar;