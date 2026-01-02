import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";

import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  AlertCircle,
} from "lucide-react";

import LoadingSpinner from "../LoadingSpinner";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Green Theme Palette
const PALETTE = {
  sage: "#6FA99F",
  emerald: "#347B66",
  lime: "#CFF56E",
  forest: "#3B4A38",
  evergreen: "#1F3326",
  base: "#E8F5E9",
};

// Soft green stat card
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="p-5 bg-[#E8F5E9] border border-[#6FA99F] rounded-2xl shadow-md hover:shadow-lg transition">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[#1F3326] text-xs font-semibold">{title}</p>
        <h3 className="text-2xl font-bold text-[#1F3326] mt-1">{value}</h3>
      </div>
      <div className="p-3 rounded-xl bg-[#347B66] shadow-md">
        <Icon size={26} className="text-white" />
      </div>
    </div>
  </div>
);

// Soft card for charts
const ChartCard = ({ title, children }) => (
  <div className="bg-[#E8F5E9] border border-[#6FA99F] p-6 rounded-2xl shadow-md">
    <h3 className="text-lg font-semibold text-[#1F3326] mb-4">{title}</h3>
    {children}
  </div>
);

const AdminDashboardOverview = () => {
  const { stats, fetchStats, isLoading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats || isLoading) return <LoadingSpinner />;

  const revenueData = [
    { month: "Jan", revenue: stats.totalRevenue / 6 },
    { month: "Feb", revenue: stats.totalRevenue / 5 },
    { month: "Mar", revenue: stats.totalRevenue / 4 },
    { month: "Apr", revenue: stats.totalRevenue / 3 },
    { month: "May", revenue: stats.totalRevenue / 2 },
    { month: "Jun", revenue: stats.totalRevenue },
  ];

  const pieData = [
    { name: "Users", value: stats.totalUsers, fill: PALETTE.emerald },
    { name: "Sellers", value: stats.totalSellers, fill: PALETTE.forest },
  ];

  const orderData = [
    { day: "Mon", orders: stats.totalOrders / 6 },
    { day: "Tue", orders: stats.totalOrders / 5 },
    { day: "Wed", orders: stats.totalOrders / 4 },
    { day: "Thu", orders: stats.totalOrders / 3 },
    { day: "Fri", orders: stats.totalOrders / 2 },
    { day: "Sat", orders: stats.totalOrders },
  ];

  return (
    <div className="min-h-screen bg-[#E8F5E9] p-4 md:p-10">

      <h2 className="text-3xl font-bold text-[#1F3326] mb-10">
        Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Total Sellers" value={stats.totalSellers} icon={Store} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Pending Verifications" value={stats.pendingSellers} icon={AlertCircle} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">

        <ChartCard title="Users vs Sellers">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue (Last 6 Months)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#1F3326" />
              <YAxis stroke="#1F3326" />
              <Tooltip />
              <Bar dataKey="revenue" fill={PALETTE.emerald} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Orders">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={orderData}>
              <XAxis dataKey="day" stroke="#1F3326" />
              <YAxis stroke="#1F3326" />
              <Tooltip />
              <Line dataKey="orders" stroke={PALETTE.evergreen} strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product Overview">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: "Products", value: stats.totalProducts, fill: PALETTE.saffron },
                  { name: "Pending", value: stats.pendingSellers, fill: PALETTE.maroon },
                ]}
                innerRadius={40}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

export default AdminDashboardOverview;
