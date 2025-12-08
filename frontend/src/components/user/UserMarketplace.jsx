import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, ShoppingCart } from "lucide-react";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import toast from "react-hot-toast";

const UserMarketplace = () => {
    const { products, isLoading } = useProductStore();
    const { addToCart } = useCartStore();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products?.filter(product => {
        const name = product.name?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return name.includes(search) || category.includes(search);
    }) || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#8C2F2B] tracking-tight">Fresh Market</h1>
                    <p className="text-[#C24C30] mt-2 font-medium">Quality produce directly from farmers</p>
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search fresh produce..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all duration-300"
                    />
                </div>
            </div>

            {/* Loader */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C42]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-64 bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Category Badge */}
                                <span className="absolute top-4 left-4 bg-white shadow-sm px-3 py-1 rounded-full text-xs font-semibold text-[#8C2F2B] uppercase tracking-wider">
                                    {product.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Price</span>
                                        <p className="text-2xl font-bold text-[#C24C30]">₹{product.price}</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            toast.success("Added to cart");
                                        }}
                                        className="bg-[#FF8C42] text-white px-5 py-2 rounded-xl font-medium shadow-sm transition active:scale-95"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart size={18} />
                                            <span>Add</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* No Items */}
            {filteredProducts.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-300">
                    <Package className="w-14 h-14 text-[#FF8C42] mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
};

export default UserMarketplace;
