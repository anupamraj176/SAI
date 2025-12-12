import React from 'react';
import { LayoutDashboard, Users, Store, Package, ShoppingBag, LogOut } from 'lucide-react';

const AdminSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'sellers', label: 'Manage Sellers', icon: Store },
    { id: 'products', label: 'Manage Products', icon: Package },
    { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] text-white h-screen flex flex-col border-r border-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#FF8C42] flex items-center gap-2">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-[#FF8C42] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
