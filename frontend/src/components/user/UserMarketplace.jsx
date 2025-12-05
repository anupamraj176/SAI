import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Package } from "lucide-react";
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
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-[#8C2F2B]">Fresh Produce Market</h1>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for fruits, vegetables..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#FFD9A0] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div
                        key={product._id}
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
                        
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-[#2B2B2B] mb-1">{product.name}</h3>
                            <p className="text-[#8C2F2B]/80 text-xs mb-3 line-clamp-2">{product.description}</p>
                            
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-[#C24C30]">₹{product.price}</span>
                                <button 
                                    onClick={() => {
                                        addToCart(product);
                                        toast.success("Added to cart");
                                    }}
                                    className="bg-[#FF8C42] hover:bg-[#E66A32] text-white p-2 rounded-lg transition-colors shadow-sm"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredProducts.length === 0 && !isLoading && (
                <div className="text-center py-20 text-[#C24C30]/50">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">No products found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default UserMarketplace;