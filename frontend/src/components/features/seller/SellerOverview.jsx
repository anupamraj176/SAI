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
    lime: "#CFF56E",
    emerald: "#347B66",
    sage: "#6FA99F",
    evergreen: "#1F3326",
    forest: "#3B4A38",
    charcoal: "#1F3326",
    white: "#FFFFFF",
    bg: "#E8F5E9" 
};

const SellerOverview = ({ user, orders, products, setActiveTab }) => {
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
            { name: "Pending", value: counts.pending, color: COLORS.sage }, // Sage
            { name: "Shipped", value: counts.shipped, color: COLORS.emerald }, // Emerald
            { name: "Delivered", value: counts.delivered, color: "#10B981" }, // Keep Green for success
            { name: "Cancelled", value: counts.cancelled, color: "#EF4444" }, // Red for cancelled
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
        <div className="space-y-5 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E8F5E9] p-6 rounded-5xl border border-[#6FA99F] shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-[#1F3326]">Dashboard Overview</h1>
                    <p className="text-sm text-[#347B66]">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#1F3326] bg-[#C8E6C9] px-3 py-1.5 rounded-lg border border-[#6FA99F]">
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
            bg: "bg-[#E8F5E9]", text: "text-[#347B66]", border: "border-[#6FA99F]",
            iconBg: "bg-[#C8E6C9]"
        },
        paprika: {
            bg: "bg-[#E8F5E9]", text: "text-[#1F3326]", border: "border-[#6FA99F]",
            iconBg: "bg-[#C8E6C9]"
        },
    };

    const currentStyle = styles[color] || styles.saffron;

    return (
        <motion.div whileHover={{ y: -2 }} className={`bg-[#E8F5E9] p-6 rounded-xl shadow-sm border border-[#6FA99F] flex flex-col justify-between h-full`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${currentStyle.iconBg} ${currentStyle.text}`}>
                    {icon}
                </div>
                {trend && (
                    <span className="flex items-center text-xs font-medium text-[#347B66] bg-[#C8E6C9] px-2 py-1 rounded-full border border-[#6FA99F]">
                        <ArrowUpRight size={12} className="mr-0.5" />{trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-[#3B4A38]">{title}</p>
                <h3 className="text-2xl font-bold text-[#1F3326] mt-1">{value}</h3>
            </div>
        </motion.div>
    );
};

const RevenueChart = ({ data }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#E8F5E9] p-6 rounded-xl shadow-sm border border-[#6FA99F]">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-[#1F3326]">Revenue Analytics</h3>
                <p className="text-xs text-[#3B4A38]">Income over time</p>
            </div>
            <div className="p-2 bg-[#C8E6C9] rounded-lg"><Activity size={16} className="text-[#347B66]" /></div>
        </div>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#347B66" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#347B66" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C8E6C9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#3B4A38' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#3B4A38' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #6FA99F', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Area type="monotone" dataKey="sales" stroke="#347B66" strokeWidth={2} fill="url(#sales)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </motion.div>
);

const StatusChart = ({ data }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#E8F5E9] p-6 rounded-xl shadow-sm border border-[#6FA99F] flex flex-col">
        <h3 className="font-bold text-[#1F3326] mb-1">Order Status</h3>
        <p className="text-xs text-[#3B4A38] mb-4">Distribution by status</p>
        <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#1F3326' }} />
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
        className="bg-[#E8F5E9] p-6 rounded-xl shadow-sm border border-[#6FA99F] h-full flex flex-col"
    >
        <div className="flex justify-between items-center mb-5">
            <div><h3 className="font-bold text-[#1F3326]">Recent Orders</h3><p className="text-xs text-[#3B4A38]">Latest transactions</p></div>
            <button onClick={() => setActiveTab("orders")} className="text-xs font-medium text-[#347B66] hover:text-[#1F3326] hover:bg-[#C8E6C9] px-3 py-1.5 rounded-lg transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto flex-1">
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b border-[#6FA99F]">
                        <th className="pb-3 text-xs font-semibold text-[#1F3326] uppercase">Order ID</th>
                        <th className="pb-3 text-xs font-semibold text-[#1F3326] uppercase">Date</th>
                        <th className="pb-3 text-xs font-semibold text-[#1F3326] uppercase">Amount</th>
                        <th className="pb-3 text-xs font-semibold text-[#1F3326] uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#6FA99F]/30">
                    {orders.map((order) => (
                        <tr key={order._id} className="group hover:bg-[#C8E6C9] transition-colors">
                            <td className="py-3 text-sm font-medium text-[#1F3326]">#{order._id.slice(-6)}</td>
                            <td className="py-3 text-sm text-[#3B4A38]"><div className="flex items-center gap-1.5"><Calendar size={12} />{new Date(order.createdAt).toLocaleDateString()}</div></td>
                            <td className="py-3 text-sm font-medium text-[#1F3326]">₹{order.totalAmount}</td>
                            <td className="py-3"><StatusBadge status={order.status} /></td>
                        </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-[#3B4A38] text-sm">No recent orders found.</td></tr>}
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
        pending: "bg-[#C8E6C9] text-[#1F3326] border-[#6FA99F]" // Green palette style
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${styles[status] || styles.pending}`}>{status}</span>;
};

const InventoryAlertList = ({ products, setActiveTab }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }} 
        className="bg-[#E8F5E9] p-6 rounded-xl shadow-sm border border-[#6FA99F] h-full flex flex-col"
    >
        <div className="flex justify-between items-center mb-5">
            <div><h3 className="font-bold text-[#1F3326]">Inventory Alerts</h3><p className="text-xs text-[#3B4A38]">Low stock items</p></div>
            <div className="p-1.5 bg-red-50 rounded-md"><AlertTriangle size={16} className="text-red-500" /></div>
        </div>
        <div className="space-y-3 flex-1">
            {products.length > 0 ? products.map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-2.5 border border-[#6FA99F] rounded-lg hover:border-[#347B66] hover:bg-[#C8E6C9] transition-all group">
                    <div className="w-10 h-10 bg-[#C8E6C9] rounded-lg overflow-hidden flex-shrink-0">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <div className="w-full h-full flex items-center justify-center text-[#3B4A38]"><ShoppingBag size={16} /></div>}
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#1F3326] truncate">{p.name}</p><p className="text-xs text-[#3B4A38] font-medium">Only {p.quantity} left</p></div>
                    <button onClick={() => setActiveTab("products")} className="text-xs px-2.5 py-1.5 bg-white border border-[#6FA99F] text-[#347B66] rounded-md hover:text-white hover:bg-[#347B66] transition-colors shadow-sm">Restock</button>
                </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 bg-[#ECFDF5] rounded-full mx-auto flex items-center justify-center mb-2"><CheckCircle size={20} className="text-[#059669]" /></div>
                    <p className="text-sm font-medium text-[#1F3326]">All Good!</p><p className="text-xs text-[#3B4A38] mt-1">Inventory levels are healthy.</p>
                </div>
            )}
        </div>
    </motion.div>
);

export default SellerOverview;