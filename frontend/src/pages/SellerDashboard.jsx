import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore"; // Import Order Store
import { 
    LayoutDashboard, 
    Package, 
    ShoppingBag, 
    HelpCircle, 
    Sparkles, 
    LogOut, 
    Plus, 
    Trash2, 
    Edit, 
    DollarSign, 
    Loader, 
    X, 
    Upload,
    CheckCircle,
    Clock,
    Truck,
    XCircle
} from "lucide-react";

const SellerDashboard = () => {
    const { logout } = useAuthStore();
    const { products, addProduct, fetchSellerProducts, deleteProduct, updateProduct, isLoading } = useProductStore();
    const { fetchSellerOrders, updateOrderStatus, orders: sellerOrders } = useOrderStore(); // Use Order Store
    
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null,
    });

    useEffect(() => {
        if (activeSection === "products") {
            fetchSellerProducts();
        }
        if (activeSection === "orders") {
            fetchSellerOrders(); // Fetch orders when section is active
        }
    }, [activeSection, fetchSellerProducts, fetchSellerOrders]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("stock", formData.stock);
        if (formData.image) data.append("image", formData.image);

        if (editingProduct) {
            await updateProduct(editingProduct._id, data);
            setEditingProduct(null);
        } else {
            await addProduct(data);
        }
        
        resetForm();
        setIsAddingProduct(false);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: null 
        });
        setIsAddingProduct(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
        setEditingProduct(null);
        const fileInput = document.getElementById("fileInput");
        if(fileInput) fileInput.value = "";
    };

    const handleLogout = () => {
        logout();
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => {
                setActiveSection(id);
                if (id !== "products") setIsAddingProduct(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                activeSection === id 
                ? "bg-[#C24C30] text-white shadow-lg" // Brick Rust for active
                : "text-[#FFD9A0] hover:bg-[#2B2B2B] hover:text-white" // Sand Nougat text, Carbon hover
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-[#FDF6E9] font-sans"> {/* Light background (Sand Nougat tint) */}
            
            {/* Sidebar - Carbon Background */}
            <aside className="w-64 bg-[#1A1A1A] border-r border-[#2B2B2B] flex flex-col shadow-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#FF8C42] mb-8 flex items-center gap-2">
                        <Sparkles className="text-[#FF8C42]" /> FarmerHub
                    </h2>
                    
                    <nav className="space-y-1">
                        <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <SidebarItem id="products" icon={Package} label="Your Products" />
                        <SidebarItem id="orders" icon={ShoppingBag} label="Your Orders" />
                        <SidebarItem id="faqs" icon={HelpCircle} label="Your FAQs" />
                        <SidebarItem id="ai" icon={Sparkles} label="CropSense AI" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-[#2B2B2B]">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[#8C2F2B] hover:bg-[#2B2B2B] hover:text-[#FF8C42] rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-[#FDF6E9]"> {/* Very light Sand Nougat */}
                {activeSection === "dashboard" && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Visualize Your Sales</h1>
                        <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                            <p className="text-lg">No orders have been placed. Check back soon!</p>
                        </div>
                    </div>
                )}

                {activeSection === "products" && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-[#8C2F2B]">Your Products</h1>
                            {!isAddingProduct && (
                                <button 
                                    onClick={() => { setIsAddingProduct(true); resetForm(); }}
                                    className="bg-[#FF8C42] hover:bg-[#E66A32] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                                >
                                    <Plus size={20} /> Add Product
                                </button>
                            )}
                        </div>

                        {isAddingProduct ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-[#FFD9A0] rounded-xl p-6 shadow-lg max-w-3xl mx-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-[#C24C30]">
                                        {editingProduct ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <button 
                                        onClick={() => { setIsAddingProduct(false); resetForm(); }}
                                        className="text-gray-400 hover:text-[#8C2F2B]"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B] h-32 resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Price (₹)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 text-[#C24C30]" size={18} />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Stock Quantity</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Product Image</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#FFD9A0] border-dashed rounded-lg cursor-pointer bg-[#FDF6E9] hover:bg-[#FFF0D4] transition">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-[#FF8C42]" />
                                                    <p className="text-sm text-[#C24C30]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                </div>
                                                <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!editingProduct} />
                                            </label>
                                        </div>
                                        {formData.image && <p className="text-sm text-[#E66A32] mt-2">Selected: {formData.image.name}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#C24C30] hover:bg-[#A03B23] text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center shadow-md"
                                    >
                                        {isLoading ? <Loader className="animate-spin" /> : (editingProduct ? "Update Product" : "Add Product")}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white rounded-xl overflow-hidden shadow-md border border-[#FFD9A0] flex flex-col group hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-[#FDF6E9]">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 bg-[#2B2B2B]/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-[#FFD9A0] font-bold shadow-sm">
                                                {product.category}
                                            </div>
                                        </div>
                                        
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-[#2B2B2B] mb-2">{product.name}</h3>
                                            <p className="text-[#8C2F2B]/80 text-sm mb-4 flex-1 line-clamp-2">{product.description}</p>
                                            
                                            <div className="flex justify-between items-center text-sm text-[#2B2B2B] mb-4 bg-[#FDF6E9] p-2 rounded">
                                                <span className="flex items-center gap-1 font-bold text-[#C24C30]"><DollarSign size={16}/> {product.price}</span>
                                                <span className="flex items-center gap-1 text-[#E66A32]"><Package size={16}/> {product.stock} left</span>
                                            </div>

                                            <div className="flex gap-3 mt-auto">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="flex-1 bg-[#FFD9A0]/30 text-[#E66A32] border border-[#FFD9A0] hover:bg-[#FFD9A0]/50 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium"
                                                >
                                                    <Edit size={16} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="flex-1 bg-[#8C2F2B]/10 text-[#8C2F2B] border border-[#8C2F2B]/30 hover:bg-[#8C2F2B]/20 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {products.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#C24C30]/50">
                                        <Package className="w-16 h-16 mb-4 opacity-40" />
                                        <p className="text-lg font-medium">No products found</p>
                                        <p className="text-sm">Add your first product to get started.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "orders" && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Your Orders</h1>
                        
                        {sellerOrders.length > 0 ? (
                            <div className="space-y-6">
                                {sellerOrders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-xl shadow-md border border-[#FFD9A0] overflow-hidden">
                                        <div className="bg-[#FDF6E9] px-6 py-4 border-b border-[#FFD9A0] flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-[#8C2F2B] uppercase font-bold">Order ID: {order._id}</p>
                                                <p className="text-sm text-[#2B2B2B]">Buyer: <span className="font-bold">{order.buyer?.name}</span></p>
                                            </div>
                                            
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#FF8C42] ${
                                                    order.status === 'Pending' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-600 border-green-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="p-6">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center mb-2 last:mb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                            {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[#2B2B2B]">{item.product?.name}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-[#8C2F2B]">₹{item.price * item.quantity}</p>
                                                </div>
                                            ))}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                                <p className="text-lg font-bold text-[#C24C30]">Total: ₹{order.totalAmount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                                <ShoppingBag className="w-16 h-16 mb-4 opacity-40" />
                                <p className="text-lg">No orders yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "faqs" && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">Frequently Asked Questions</h1>
                        <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                            <HelpCircle className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-lg">FAQ section coming soon.</p>
                        </div>
                    </div>
                )}

                {activeSection === "ai" && (
                    <div className="h-full flex flex-col">
                        <h1 className="text-3xl font-bold text-[#8C2F2B] mb-8">CropSense AI</h1>
                        <div className="flex-1 flex flex-col items-center justify-center text-[#C24C30]/60">
                            <Sparkles className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-lg">AI insights coming soon.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SellerDashboard;