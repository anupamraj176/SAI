import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, Package } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  paprika: "#E66A32",
  nougat: "#FFF6E9",
  rust: "#C24C30",
  maroon: "#8C2F2B",
  saffron: "#FFB444",
};

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct, isLoading } =
    useAdminStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-10 bg-[#FAF3E3] min-h-screen">
      <h2 className="text-3xl font-bold text-[#2B2B2B] mb-8">
        Manage Products
      </h2>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-[#FFF6E9] rounded-2xl shadow-xl border border-[#EAD7BD] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F3E6D3] border-b border-[#EAD7BD]">
            <tr>
              <th className="p-4 font-semibold text-[#8C2F2B]">Product</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Seller</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Category</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Price</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Stock</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAD7BD]">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-[#F7EDE1] transition"
              >
                {/* PRODUCT IMAGE + NAME */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#EAD7BD]"
                  />
                  <span className="font-medium text-[#2B2B2B]">
                    {product.name}
                  </span>
                </td>

                {/* SELLER */}
                <td className="p-4 text-[#8C2F2B]">
                  {product.seller?.name || "Unknown"}
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  <span className="bg-[#F3E6D3] text-[#8C2F2B] px-3 py-1 rounded-md text-xs font-semibold border border-[#EAD7BD]">
                    {product.category}
                  </span>
                </td>

                {/* PRICE */}
                <td className="p-4 font-bold text-[#2B2B2B]">
                  ₹{product.price}
                </td>

                {/* STOCK */}
                <td className="p-4">
                  <span
                    className={`text-sm font-semibold ${
                      product.stock < 10
                        ? "text-red-600"
                        : "text-[#8C2F2B]"
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
          <div className="p-8 text-center text-[#8C2F2B]">
            No products found.
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div 
            key={product._id}
            className="bg-[#FFF6E9] p-4 rounded-xl shadow-md border border-[#EAD7BD] space-y-3"
          >
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover border border-[#EAD7BD] bg-[#F3E6D3]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#2B2B2B] truncate">{product.name}</h3>
                <p className="text-xs text-[#8C2F2B] truncate">Seller: {product.seller?.name || "Unknown"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#F3E6D3] text-[#8C2F2B] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#EAD7BD]">
                    {product.category}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      product.stock < 10 ? "text-red-600" : "text-[#8C2F2B]"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#EAD7BD]/50">
              <span className="text-lg font-bold text-[#2B2B2B]">₹{product.price}</span>
              
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
          <div className="p-8 text-center text-[#8C2F2B] bg-[#FFF6E9] rounded-xl border border-[#EAD7BD]">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
