import React from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  LogOut,
  X
} from "lucide-react";

const PALETTE = {
  paprika: "#E66A32",
  saffron: "#FFB444",
  maroon: "#8C2F2B",
  carbon: "#2B2B2B",
  beige: "#FAF3E3",
};

const AdminSidebar = ({ activeSection, setActiveSection, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "sellers", label: "Manage Sellers", icon: Store },
    { id: "products", label: "Manage Products", icon: Package },
    { id: "orders", label: "Manage Orders", icon: ShoppingBag },
  ];

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
          w-64 bg-[#2B2B2B] text-white h-[100dvh] flex flex-col border-r border-[#403A34] shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* HEADER */}
        <div className="p-6 border-b border-[#403A34] flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-transparent bg-clip-text">
              Admin Panel
            </span>
          </h2>
          {/* Close Button (Mobile Only) */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
              <X size={24} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-white shadow-md scale-[1.02]"
                    : "text-[#EEDFCC] hover:bg-[#3A3A3A] hover:text-white"
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-[#403A34]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-[#3A3A3A] text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
