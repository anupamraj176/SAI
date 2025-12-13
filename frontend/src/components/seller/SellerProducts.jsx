import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Trash2 } from "lucide-react";
import { useProductStore } from "../../store/productStore";

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#8C2F2B]">Manage Products</h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF8C42] text-white px-4 py-2 rounded-lg flex items-center gap-2 
                     hover:bg-[#E66A32] shadow-md transition"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="rounded-xl shadow-sm border border-[#EAD7BD] bg-[#FFF6E9] overflow-hidden hover:shadow-md transition"
          >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />

            <div className="p-4">
              <h3 className="font-bold text-lg text-[#2B2B2B]">{product.name}</h3>
              <p className="text-sm text-[#C24C30]">{product.category}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-[#8C2F2B]">₹{product.price}</span>
                
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-lg p-6 relative bg-[#FFF6E9] border border-[#EAD7BD] shadow-xl">

            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8C2F2B] hover:text-[#C24C30]"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-[#8C2F2B] mb-4">Add New Product</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input 
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#EAD7BD] rounded-lg bg-[#FFF6E9]
                           focus:ring-2 focus:ring-[#FF8C42] outline-none"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-[#EAD7BD] rounded-lg bg-[#FFF6E9]
                           focus:ring-2 focus:ring-[#FF8C42] outline-none"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#EAD7BD] rounded-lg bg-[#FFF6E9]"
                  required
                />

                <input 
                  type="number"
                  name="stock"
                  placeholder="Stock Qty"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#EAD7BD] rounded-lg bg-[#FFF6E9]"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-3 border border-[#EAD7BD] rounded-lg bg-[#FFF6E9] flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.icon || "📦"}
                    {CATEGORY_OPTIONS.find(c => c.id === formData.category)?.label || "Select Category"}
                  </span>
                  ▾
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-full bg-[#FFF6E9] border border-[#EAD7BD] rounded-lg shadow-lg max-h-52 overflow-y-auto z-50">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          setDropdownOpen(false);
                        }}
                        className="p-3 hover:bg-[#FAF3E3] cursor-pointer flex items-center gap-3"
                      >
                        <span>{cat.icon}</span>
                        <span className="text-[#2B2B2B]">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload (NO DASHED BORDER NOW) */}
              <label className="block w-full rounded-lg p-4 text-center cursor-pointer bg-[#FFF6E9] border border-[#EAD7BD] hover:bg-[#FAF3E3] transition">
                <input 
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload size={26} className="mx-auto text-[#C24C30]" />
                <p className="mt-2 text-sm text-[#8C2F2B]">
                  {formData.image ? formData.image.name : "Upload Image"}
                </p>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF8C42] text-white py-3 rounded-lg font-bold hover:bg-[#E66A32] transition disabled:opacity-50"
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
