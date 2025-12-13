import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSellers from '../components/admin/AdminSellers';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#2B2B2B] text-white p-4 z-40 flex items-center justify-between shadow-md">
          <span className="font-bold text-lg bg-gradient-to-r from-[#E66A32] to-[#FFB444] text-transparent bg-clip-text">
              Admin Panel
          </span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
              <Menu size={24} />
          </button>
      </div>

      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
        }} 
        onLogout={logout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
        {activeSection === 'dashboard' && <AdminDashboardOverview />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'sellers' && <AdminSellers />}
        {activeSection === 'products' && <AdminProducts />}
        {activeSection === 'orders' && <AdminOrders />}
      </main>
    </div>
  );
};

export default AdminDashboard;
