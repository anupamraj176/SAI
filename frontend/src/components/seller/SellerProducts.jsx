import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, DollarSign, Upload, Loader, Edit, Trash2, Package } from "lucide-react";
import { useProductStore } from "../../store/productStore";

const SellerProducts = () => {
    const { products, addProduct, deleteProduct, updateProduct, isLoading } = useProductStore();
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "", image: null });

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
        setEditingProduct(null);
        const fileInput = document.getElementById("fileInput");
        if(fileInput) fileInput.value = "";
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        if (editingProduct) {
            await updateProduct(editingProduct._id, data);
        } else {
            await addProduct(data);
        }
        resetForm();
        setIsAddingProduct(false);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({ ...product, image: null });
        setIsAddingProduct(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product?")) await deleteProduct(id);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#8C2F2B]">Your Products</h1>
                {!isAddingProduct && (
                    <button onClick={() => { setIsAddingProduct(true); resetForm(); }} className="bg-[#FF8C42] hover:bg-[#E66A32] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md">
                        <Plus size={20} /> Add Product
                    </button>
                )}
            </div>

            {isAddingProduct ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#FFD9A0] rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[#C24C30]">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <button onClick={() => { setIsAddingProduct(false); resetForm(); }} className="text-gray-400 hover:text-[#8C2F2B]"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2 h-32 resize-none" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Price (₹)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg px-4 py-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#8C2F2B] mb-1">Image</label>
                            <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="w-full" required={!editingProduct} />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-[#C24C30] hover:bg-[#A03B23] text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center">
                            {isLoading ? <Loader className="animate-spin" /> : (editingProduct ? "Update" : "Add")}
                        </button>
                    </form>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <motion.div key={product._id} layout className="bg-white rounded-xl overflow-hidden shadow-md border border-[#FFD9A0] flex flex-col">
                            <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-[#2B2B2B]">{product.name}</h3>
                                <p className="text-[#8C2F2B]/80 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="font-bold text-[#C24C30]">₹{product.price}</span>
                                    <span className="text-[#E66A32]">{product.stock} left</span>
                                </div>
                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => handleEditClick(product)} className="flex-1 bg-[#FFD9A0]/30 text-[#E66A32] border border-[#FFD9A0] py-2 rounded-lg flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                                    <button onClick={() => handleDelete(product._id)} className="flex-1 bg-[#8C2F2B]/10 text-[#8C2F2B] border border-[#8C2F2B]/30 py-2 rounded-lg flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default SellerProducts;