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

  // ------------------- LOADING -------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#347B66]"></div>
      </div>
    );
  }

  // ------------------- EMPTY WISHLIST -------------------
  if (wishlist.length === 0) {
    return (
      <div className="p-6 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1F3326] mb-4">My Wishlist</h2>

        <div className="bg-[#E8F5E9] rounded-2xl p-10 border border-[#6FA99F] shadow-sm">
          <Heart size={50} className="mx-auto text-[#6FA99F] mb-4" />
          <p className="text-[#3B4A38] text-lg mb-6">Your wishlist is empty.</p>

          <Link 
            to="/user-dashboard/marketplace"
            className="bg-gradient-to-r from-[#347B66] to-[#6FA99F] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ------------------- WISHLIST GRID -------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1F3326] mb-6">My Wishlist ({wishlist.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl border border-[#6FA99F] shadow-sm overflow-hidden 
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative"
          >
            {/* ------------------- IMAGE ------------------- */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={product.image || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* REMOVE FROM WISHLIST */}
              <button 
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-red-50 
                           text-red-500 transition-colors z-10 shadow-sm"
                title="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>

              {/* LOW STOCK BADGE */}
              {product.stock < 10 && (
                <span className="absolute top-2 left-2 bg-[#347B66] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Low Stock
                </span>
              )}
            </div>

            {/* ------------------- DETAILS ------------------- */}
            <div className="p-4 space-y-2">

              <div>
                <h3 className="font-bold text-lg text-[#1F3326]">{product.name}</h3>
                <p className="text-xs text-[#347B66]">{product.category}</p>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.description}
              </p>

              {/* PRICE + ADD BUTTON */}
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#1F3326]">₹{product.price}</span>

                <button
                  onClick={() => addToCart(product)}
                  className="bg-gradient-to-r from-[#347B66] to-[#6FA99F] text-white px-3 py-2 rounded-lg shadow 
                             hover:opacity-90 transition flex items-center gap-2 text-sm font-medium"
                >
                  <ShoppingCart size={18} />
                  Add
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
