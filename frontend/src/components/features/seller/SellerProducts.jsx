import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Trash2, Package } from "lucide-react";
import { useProductStore } from "../../../store/productStore";

const CATEGORY_OPTIONS = [
  { id: "Vegetables", label: "Vegetables", icon: "🥦" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grains", label: "Grains", icon: "🌾" },
  { id: "Pulses", label: "Pulses", icon: "🫘" },
  { id: "Spices", label: "Spices", icon: "🧂" },
  { id: "Nuts", label: "Nuts", icon: "🥜" },
  { id: "Sugar", label: "Sugar", icon: "🍬" },
  { id: "Seeds", label: "Seeds", icon: "🌱" },
  { id: "Eggs", label: "Eggs", icon: "🥚" },
  { id: "Beverages", label: "Juices & Beverages", icon: "🧃" },
  { id: "Oil", label: "Edible Oils", icon: "🫗" },
  { id: "Bakery", label: "Bakery Items", icon: "🧁" },
  { id: "Pickles", label: "Pickles & Homemade", icon: "🫙" },
  { id: "Snacks", label: "Healthy Snacks", icon: "🍿" },
  { id: "Tea", label: "Tea & Coffee", icon: "☕" },
  { id: "DryFruits", label: "Dry Fruits", icon: "🥭" },
];

const SellerProducts = () => {
  const { products, fetchSellerProducts, addProduct, deleteProduct, isLoading } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    const result = await addProduct(data);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-[#1F3326]">Manage Products</h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#347B66] text-white px-4 py-2 rounded-lg flex items-center gap-2 
                     hover:bg-[#1F3326] shadow-md transition w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            // UPDATED: Removed 'group', 'hover:shadow-xl', 'hover:-translate-y-1', 'transition'
            className="rounded-2xl shadow-md border border-[#6FA99F] bg-white overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
              <img 
                src={product.image} 
                alt={product.name} 
                // UPDATED: Removed 'group-hover:scale-110'
                className="w-full h-full object-cover" 
              />
              
              {/* Category Badge */}
              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full 
                             shadow-sm flex items-center gap-1 border border-[#6FA99F]">
                <span className="text-sm">
                  {CATEGORY_OPTIONS.find(c => c.id === product.category)?.icon || "📦"}
                </span>
                <span className="text-[10px] font-bold text-[#1F3326] uppercase tracking-wide">{product.category}</span>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-2 right-2 bg-[#347B66] text-white px-2 py-1 rounded-full 
                             shadow-sm flex items-center gap-1 text-[10px] font-bold">
                <Package size={12} />
                <span>{product.stock || 0}</span>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#1F3326] mb-1 line-clamp-1">
                {product.name}
              </h3>
              
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">
                {product.description || "Fresh and organic product"}
              </p>

              {/* Price and Action Row */}
              <div className="flex justify-between items-center pt-3 border-t border-[#6FA99F]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">Price</span>
                  <span className="text-xl font-bold text-[#1F3326]">₹{product.price}</span>
                </div>
                
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg 
                             transition-all duration-200 group/btn shadow-sm hover:shadow-md"
                  title="Delete Product"
                >
                  <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-lg p-6 relative bg-[#E8F5E9] border border-[#6FA99F] shadow-xl">

            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#1F3326] hover:text-[#347B66]"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-[#1F3326] mb-4">Add New Product</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input 
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#6FA99F] rounded-lg bg-[#E8F5E9]
                           focus:ring-2 focus:ring-[#347B66] outline-none"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-[#6FA99F] rounded-lg bg-[#E8F5E9]
                           focus:ring-2 focus:ring-[#347B66] outline-none"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#6FA99F] rounded-lg bg-[#E8F5E9]"
                  required
                />

                <input 
                  type="number"
                  name="stock"
                  placeholder="Stock Qty"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#6FA99F] rounded-lg bg-[#E8F5E9]"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-3 border border-[#6FA99F] rounded-lg bg-[#E8F5E9] flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.icon || "📦"}
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.label || "Select Category"}
                  </span>
                  ▾
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-[#E8F5E9] border border-[#6FA99F] rounded-lg shadow-lg max-h-52 overflow-y-auto z-50">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          setDropdownOpen(false);
                        }}
                        className="p-3 hover:bg-[#C8E6C9] cursor-pointer flex items-center gap-3"
                      >
                        <span>{cat.icon}</span>
                        <span className="text-[#1F3326]">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <label className="block w-full rounded-lg p-4 text-center cursor-pointer bg-[#E8F5E9] border border-[#6FA99F] hover:bg-[#C8E6C9] transition">
                <input 
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload size={26} className="mx-auto text-[#347B66]" />
                <p className="mt-2 text-sm text-[#1F3326]">
                  {formData.image ? formData.image.name : "Upload Image"}
                </p>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#347B66] text-white py-3 rounded-lg font-bold hover:bg-[#1F3326] transition disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default SellerProducts;