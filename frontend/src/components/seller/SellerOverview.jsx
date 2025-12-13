import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    DollarSign, Package, TrendingUp, Activity,
    Clock, CheckCircle, AlertTriangle,
    ShoppingBag, ArrowUpRight, Calendar
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// Color Palette Constants
const COLORS = {
    saffron: "#FF8C42",
    paprika: "#E66A32",
    nougat: "#FFD9A0",
    maroon: "#8C2F2B",
    rust: "#C24C30",
    carbon: "#2B2B2B",
    white: "#FFFFFF",
    bg: "#FDF6E9" // Light sand background
};

const SellerOverview = ({ user, orders, products, setActiveTab }) => {
    
    // —————————————— Calculations ——————————————
    const totalSales = useMemo(() => {
        return orders?.reduce((acc, order) => {
            if (order.status?.toLowerCase() === "delivered") {
                return acc + (order.totalAmount || 0);
            }
            return acc;
        }, 0) || 0;
    }, [orders]);

    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;

    const chartData = useMemo(() => {
        if (!orders?.length) return [];
        const grouped = {};
        orders.forEach((order) => {
            const dateObj = new Date(order.createdAt);
            if (isNaN(dateObj.getTime())) return;
            const date = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            
            if (!grouped[date]) grouped[date] = { name: date, sales: 0, orders: 0, raw: dateObj };
            if (order.status?.toLowerCase() === "delivered") grouped[date].sales += order.totalAmount || 0;
            grouped[date].orders += 1;
        });
        return Object.values(grouped).sort((a, b) => a.raw - b.raw);
    }, [orders]);

    const statusData = useMemo(() => {
        if (!orders) return [];
        const counts = { pending: 0, shipped: 0, delivered: 0, cancelled: 0 };
        orders.forEach((order) => {
            const s = order.status?.toLowerCase() || "pending";
            if (counts[s] !== undefined) counts[s]++;
        });
        return [
            { name: "Pending", value: counts.pending, color: COLORS.saffron }, // Saffron
            { name: "Shipped", value: counts.shipped, color: COLORS.paprika }, // Paprika
            { name: "Delivered", value: counts.delivered, color: "#10B981" }, // Keep Green for success
            { name: "Cancelled", value: counts.cancelled, color: COLORS.rust }, // Rust
        ].filter((d) => d.value > 0);
    }, [orders]);

    const recentOrders = useMemo(() => {
        return orders?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) || [];
    }, [orders]);

    const lowStockProducts = useMemo(() => {
        return products?.filter((p) => p.quantity < 10).slice(0, 4) || [];
    }, [products]);

    // —————————————— Render ——————————————
    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FFF6E9] p-6 rounded-xl border border-[#EAD7BD] shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-[#8C2F2B]">Dashboard Overview</h1>
                    <p className="text-sm text-[#C24C30]">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#8C2F2B] bg-[#FAF3E3] px-3 py-1.5 rounded-lg border border-[#EAD7BD]">
                    <Clock size={14} />
                    <span>Updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalSales.toLocaleString()}`} 
                    icon={<DollarSign size={20} />} 
                    color="green" 
                    trend="+12.5%" 
                />
                <StatCard 
                    title="Active Products" 
                    value={totalProducts} 
                    icon={<Package size={20} />} 
                    color="saffron" 
                />
                <StatCard 
                    title="Total Orders" 
                    value={totalOrders} 
                    icon={<TrendingUp size={20} />} 
                    color="paprika" 
                    trend="+5.2%" 
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart data={chartData} />
                <StatusChart data={statusData} />
            </div>

            {/* Bottom Section - Fixed Layout with Flex/Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-2 h-full">
                    <RecentOrdersTable orders={recentOrders} setActiveTab={setActiveTab} />
                </div>
                <div className="h-full">
                    <InventoryAlertList products={lowStockProducts} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>
    );
};

// —————————————— Sub-Components ——————————————

const StatCard = ({ title, value, icon, color, trend }) => {
    // Mapping colors to the new palette styles
    const styles = {
        green: {
            bg: "bg-[#ECFDF5]", text: "text-[#059669]", border: "border-[#A7F3D0]",
            iconBg: "bg-[#D1FAE5]"
        },
        saffron: {
            bg: "bg-[#FFF7ED]", text: "text-[#FF8C42]", border: "border-[#FFD9A0]",
            iconBg: "bg-[#FFEDD5]"
        },
        paprika: {
            bg: "bg-[#FFF5F5]", text: "text-[#E66A32]", border: "border-[#FECACA]",
            iconBg: "bg-[#FEE2E2]"
        },
    };

    const currentStyle = styles[color] || styles.saffron;

    return (
        <motion.div whileHover={{ y: -2 }} className={`bg-[#FFF6E9] p-6 rounded-xl shadow-sm border border-[#EAD7BD] flex flex-col justify-between h-full`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${currentStyle.iconBg} ${currentStyle.text}`}>
                    {icon}
                </div>
                {trend && (
                    <span className="flex items-center text-xs font-medium text-[#E66A32] bg-[#FFF7ED] px-2 py-1 rounded-full border border-[#FFD9A0]">
                        <ArrowUpRight size={12} className="mr-0.5" />{trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-[#C24C30]">{title}</p>
                <h3 className="text-2xl font-bold text-[#2B2B2B] mt-1">{value}</h3>
            </div>
        </motion.div>
    );
};

const RevenueChart = ({ data }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#FFF6E9] p-6 rounded-xl shadow-sm border border-[#EAD7BD]">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-[#2B2B2B]">Revenue Analytics</h3>
                <p className="text-xs text-[#C24C30]">Income over time</p>
            </div>
            <div className="p-2 bg-[#FAF3E3] rounded-lg"><Activity size={16} className="text-[#E66A32]" /></div>
        </div>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#FF8C42" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FAF3E3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#C24C30' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#C24C30' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAD7BD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Area type="monotone" dataKey="sales" stroke="#FF8C42" strokeWidth={2} fill="url(#sales)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </motion.div>
);

const StatusChart = ({ data }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#FFF6E9] p-6 rounded-xl shadow-sm border border-[#EAD7BD] flex flex-col">
        <h3 className="font-bold text-[#2B2B2B] mb-1">Order Status</h3>
        <p className="text-xs text-[#C24C30] mb-4">Distribution by status</p>
        <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#2B2B2B' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </motion.div>
);

const RecentOrdersTable = ({ orders, setActiveTab }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-[#FFF6E9] p-6 rounded-xl shadow-sm border border-[#EAD7BD] h-full flex flex-col"
    >
        <div className="flex justify-between items-center mb-5">
            <div><h3 className="font-bold text-[#2B2B2B]">Recent Orders</h3><p className="text-xs text-[#C24C30]">Latest transactions</p></div>
            <button onClick={() => setActiveTab("orders")} className="text-xs font-medium text-[#E66A32] hover:text-[#FF8C42] hover:bg-[#FFF7ED] px-3 py-1.5 rounded-lg transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto flex-1">
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b border-[#EAD7BD]">
                        <th className="pb-3 text-xs font-semibold text-[#8C2F2B] uppercase">Order ID</th>
                        <th className="pb-3 text-xs font-semibold text-[#8C2F2B] uppercase">Date</th>
                        <th className="pb-3 text-xs font-semibold text-[#8C2F2B] uppercase">Amount</th>
                        <th className="pb-3 text-xs font-semibold text-[#8C2F2B] uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD7BD]/30">
                    {orders.map((order) => (
                        <tr key={order._id} className="group hover:bg-[#FAF3E3] transition-colors">
                            <td className="py-3 text-sm font-medium text-[#2B2B2B]">#{order._id.slice(-6)}</td>
                            <td className="py-3 text-sm text-[#C24C30]"><div className="flex items-center gap-1.5"><Calendar size={12} />{new Date(order.createdAt).toLocaleDateString()}</div></td>
                            <td className="py-3 text-sm font-medium text-[#2B2B2B]">₹{order.totalAmount}</td>
                            <td className="py-3"><StatusBadge status={order.status} /></td>
                        </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-[#C24C30] text-sm">No recent orders found.</td></tr>}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const styles = { 
        delivered: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        shipped: "bg-blue-100 text-blue-700 border-blue-200", 
        cancelled: "bg-red-100 text-red-700 border-red-200", 
        pending: "bg-[#FFF7ED] text-[#E66A32] border-[#FFD9A0]" // Saffron/Nougat style
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${styles[status] || styles.pending}`}>{status}</span>;
};

const InventoryAlertList = ({ products, setActiveTab }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }} 
        className="bg-[#FFF6E9] p-6 rounded-xl shadow-sm border border-[#EAD7BD] h-full flex flex-col"
    >
        <div className="flex justify-between items-center mb-5">
            <div><h3 className="font-bold text-[#2B2B2B]">Inventory Alerts</h3><p className="text-xs text-[#C24C30]">Low stock items</p></div>
            <div className="p-1.5 bg-[#FFF5F5] rounded-md"><AlertTriangle size={16} className="text-[#C24C30]" /></div>
        </div>
        <div className="space-y-3 flex-1">
            {products.length > 0 ? products.map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-2.5 border border-[#EAD7BD] rounded-lg hover:border-[#E66A32] hover:bg-[#FAF3E3] transition-all group">
                    <div className="w-10 h-10 bg-[#FAF3E3] rounded-lg overflow-hidden flex-shrink-0">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <div className="w-full h-full flex items-center justify-center text-[#C24C30]"><ShoppingBag size={16} /></div>}
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#2B2B2B] truncate">{p.name}</p><p className="text-xs text-[#C24C30] font-medium">Only {p.quantity} left</p></div>
                    <button onClick={() => setActiveTab("products")} className="text-xs px-2.5 py-1.5 bg-white border border-[#EAD7BD] text-[#E66A32] rounded-md hover:text-white hover:bg-[#E66A32] transition-colors shadow-sm">Restock</button>
                </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 bg-[#ECFDF5] rounded-full mx-auto flex items-center justify-center mb-2"><CheckCircle size={20} className="text-[#059669]" /></div>
                    <p className="text-sm font-medium text-[#2B2B2B]">All Good!</p><p className="text-xs text-[#C24C30] mt-1">Inventory levels are healthy.</p>
                </div>
            )}
        </div>
    </motion.div>
);

export default SellerOverview;