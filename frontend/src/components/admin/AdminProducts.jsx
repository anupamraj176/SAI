import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, Package } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  emerald: "#347B66",
  lime: "#CFF56E",
  forest: "#3B4A38",
  evergreen: "#1F3326",
  sage: "#6FA99F",
};

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct, isLoading } =
    useAdminStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-10 bg-[#E8F5E9] min-h-screen">
      <h2 className="text-3xl font-bold text-[#1F3326] mb-8">
        Manage Products
      </h2>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-[#E8F5E9] rounded-2xl shadow-xl border border-[#6FA99F] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#C8E6C9] border-b border-[#6FA99F]">
            <tr>
              <th className="p-4 font-semibold text-[#1F3326]">Product</th>
              <th className="p-4 font-semibold text-[#1F3326]">Seller</th>
              <th className="p-4 font-semibold text-[#1F3326]">Category</th>
              <th className="p-4 font-semibold text-[#1F3326]">Price</th>
              <th className="p-4 font-semibold text-[#1F3326]">Stock</th>
              <th className="p-4 font-semibold text-[#1F3326]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#6FA99F]">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-[#C8E6C9] transition"
              >
                {/* PRODUCT IMAGE + NAME */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#6FA99F]"
                  />
                  <span className="font-medium text-[#1F3326]">
                    {product.name}
                  </span>
                </td>

                {/* SELLER */}
                <td className="p-4 text-[#3B4A38]">
                  {product.seller?.name || "Unknown"}
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  <span className="bg-[#C8E6C9] text-[#1F3326] px-3 py-1 rounded-md text-xs font-semibold border border-[#6FA99F]">
                    {product.category}
                  </span>
                </td>

                {/* PRICE */}
                <td className="p-4 font-bold text-[#1F3326]">
                  ₹{product.price}
                </td>

                {/* STOCK */}
                <td className="p-4">
                  <span
                    className={`text-sm font-semibold ${
                      product.stock < 10
                        ? "text-red-600"
                        : "text-[#1F3326]"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this product?")) {
                        deleteProduct(product._id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-center text-[#1F3326]">
            No products found.
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div 
            key={product._id}
            className="bg-[#E8F5E9] p-4 rounded-xl shadow-md border border-[#6FA99F] space-y-3"
          >
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover border border-[#6FA99F] bg-[#C8E6C9]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#1F3326] truncate">{product.name}</h3>
                <p className="text-xs text-[#3B4A38] truncate">Seller: {product.seller?.name || "Unknown"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#C8E6C9] text-[#1F3326] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#6FA99F]">
                    {product.category}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      product.stock < 10 ? "text-red-600" : "text-[#1F3326]"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#6FA99F]/50">
              <span className="text-lg font-bold text-[#1F3326]">₹{product.price}</span>
              
              <button
                onClick={() => {
                  if (window.confirm("Delete this product?")) {
                    deleteProduct(product._id);
                  }
                }}
                className="bg-red-100 text-red-700 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-xs font-bold"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="p-8 text-center text-[#1F3326] bg-[#E8F5E9] rounded-xl border border-[#6FA99F]">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
