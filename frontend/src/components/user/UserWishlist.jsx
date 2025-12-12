import React, { useEffect } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserWishlist = () => {
  const { wishlist, fetchWishlist, toggleWishlist, isLoading } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C42]"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-[#2B2B2B] mb-4">My Wishlist</h2>
        <div className="bg-white rounded-xl p-10 border border-dashed border-gray-300">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-6">Your wishlist is empty.</p>
          <Link 
            to="/user-dashboard/marketplace" 
            className="bg-[#FF8C42] text-white px-6 py-2 rounded-lg hover:bg-[#e67e3b] transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">My Wishlist ({wishlist.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl border border-[#FFD9A0] shadow-sm overflow-hidden 
                     hover:shadow-md transition-shadow group relative"
          >
            {/* Product Image */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={product.image || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <button 
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors z-10 shadow-sm"
                title="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-[#2B2B2B]">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#8C2F2B]">₹{product.price}</span>

                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#FF8C42] text-white p-2 rounded-lg hover:bg-[#e67e3b] transition-colors 
                             flex items-center gap-2 text-sm font-medium"
                >
                  <ShoppingCart size={18} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWishlist;
