import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSellers from '../components/admin/AdminSellers';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onLogout={logout} 
      />

      <main className="flex-1 overflow-y-auto">
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
