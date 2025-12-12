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

// Recharts
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
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Full warm palette
const PALETTE = {
  saffron: "#FFB444",
  paprika: "#E66A32",
  nougat: "#FFD9A0",
  rust: "#C24C30",
  maroon: "#8C2F2B",
  carbon: "#2B2B2B",
};

// Premium stat card with warm gradient + glass morphism
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md bg-gradient-to-br from-[#3A3A3A]/60 via-[#2B2B2B]/60 to-[#1E1E1E]/60 hover:scale-[1.02] transition cursor-pointer">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[#FFD9A0] text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>

      <div className="p-3 rounded-xl shadow-md bg-gradient-to-br from-[#E66A32] via-[#C24C30] to-[#8C2F2B]">
        <Icon size={26} className="text-white" />
      </div>
    </div>
  </div>
);

// Chart wrapper card
const ChartCard = ({ title, children }) => (
  <div className="bg-gradient-to-br from-[#3A3A3A]/40 via-[#2B2B2B]/40 to-[#1E1E1E]/40 p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">
    <h3 className="text-lg font-semibold text-[#FFD9A0] mb-4">{title}</h3>
    {children}
  </div>
);

const AdminDashboardOverview = () => {
  const { stats, fetchStats, isLoading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats || isLoading) return <LoadingSpinner />;

  // Chart Data (example)
  const revenueData = [
    { month: "Jan", revenue: stats.totalRevenue / 6 },
    { month: "Feb", revenue: stats.totalRevenue / 5 },
    { month: "Mar", revenue: stats.totalRevenue / 4 },
    { month: "Apr", revenue: stats.totalRevenue / 3 },
    { month: "May", revenue: stats.totalRevenue / 2 },
    { month: "Jun", revenue: stats.totalRevenue },
  ];

  const pieData = [
    { name: "Users", value: stats.totalUsers, fill: PALETTE.paprika },
    { name: "Sellers", value: stats.totalSellers, fill: PALETTE.rust },
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
    <div className="min-h-screen w-full p-10 bg-gradient-to-br from-[#2B2B2B] via-[#3A3A3A] to-[#1E1E1E]">

      <h2 className="text-4xl font-bold text-[#FFD9A0] mb-10 drop-shadow-lg">
        Dashboard Overview
      </h2>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Total Sellers" value={stats.totalSellers} icon={Store} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Pending Verifications" value={stats.pendingSellers} icon={AlertCircle} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12 mb-20">

        {/* Pie Chart */}
        <ChartCard title="Users vs Sellers">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((item, index) => (
                  <Cell key={index} fill={item.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#2B2B2B", border: "1px solid #FFD9A0" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Revenue (Last 6 Months)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#FFD9A0" />
              <YAxis stroke="#FFD9A0" />
              <Tooltip contentStyle={{ background: "#2B2B2B", border: "1px solid #FFD9A0" }} />
              <Legend />
              <Bar dataKey="revenue" fill={PALETTE.paprika} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line Chart */}
        <ChartCard title="Weekly Orders">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={orderData}>
              <XAxis dataKey="day" stroke="#FFD9A0" />
              <YAxis stroke="#FFD9A0" />
              <Tooltip contentStyle={{ background: "#2B2B2B", border: "1px solid #FFD9A0" }} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={PALETTE.maroon}
                strokeWidth={3}
                dot={{ r: 4, fill: PALETTE.nougat }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Doughnut Chart */}
        <ChartCard title="Product Overview">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: "Products", value: stats.totalProducts, fill: PALETTE.saffron },
                  { name: "Pending", value: stats.pendingSellers, fill: PALETTE.maroon },
                ]}
                innerRadius={50}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              />
              <Tooltip contentStyle={{ background: "#2B2B2B", border: "1px solid #FFD9A0" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

export default AdminDashboardOverview;
