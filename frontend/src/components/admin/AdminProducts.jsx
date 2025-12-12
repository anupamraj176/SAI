import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Trash2, Package } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct, isLoading } = useAdminStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Seller</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  />
                  <span className="font-medium text-gray-800">{product.name}</span>
                </td>
                <td className="p-4 text-gray-600">{product.seller?.name || 'Unknown'}</td>
                <td className="p-4 text-gray-600">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-800">₹{product.price}</td>
                <td className="p-4">
                  <span className={`text-sm ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this product?')) {
                        deleteProduct(product._id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
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
          <div className="p-8 text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
