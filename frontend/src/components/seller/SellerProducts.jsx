import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Trash2 } from "lucide-react";
import { useProductStore } from "../../store/productStore";

// CATEGORY OPTIONS WITH EMOJIS (Shown in dropdown)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
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

    if (formData.image) {
      data.append("image", formData.image);
    }

    const result = await addProduct(data);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2B2B2B]">My Products</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e67e3b]"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-[#FFD9A0] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{product.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#8C2F2B] font-bold">₹{product.price}</span>
                <button 
                  onClick={() => deleteProduct(product._id)} 
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold mb-4">Add New Product</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input 
                type="text" 
                name="name" 
                placeholder="Product Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-lg" 
                required 
              />

              <textarea 
                name="description" 
                placeholder="Description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-lg" 
                required 
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  name="price" 
                  placeholder="Price (₹)" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border rounded-lg" 
                  required 
                />
                <input 
                  type="number" 
                  name="stock" 
                  placeholder="Stock Qty" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border rounded-lg" 
                  required 
                />
              </div>

              {/* CUSTOM CATEGORY DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-3 border rounded-lg flex justify-between items-center bg-white text-left"
                >
                  <span className="flex items-center gap-2">
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.icon || "📦"}
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.label || "Select Category"}
                  </span>
                  <span>▾</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg max-h-52 overflow-y-auto z-50">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          setDropdownOpen(false);
                        }}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* IMAGE UPLOAD */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload" 
                  accept="image/*" 
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                  <Upload size={24} />
                  <span>{formData.image ? formData.image.name : "Upload Product Image"}</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#FF8C42] text-white py-3 rounded-lg font-bold hover:bg-[#e67e3b] disabled:opacity-50"
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
