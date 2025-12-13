import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Map as MapIcon, List, ArrowLeft, Heart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import MapComponent from '../MapComponent';
import vegetableImage from '../../../assets/vegetable.jpg';
import fruitsImage from '../../../assets/fruits.webp';
import grainsImage from '../../../assets/grains.avif';
import pulsesImage from '../../../assets/pulses.webp';
import spicesImage from '../../../assets/spices.avif';
import nutsImage from '../../../assets/nuts.avif';
import sugarImage from '../../../assets/sugar.avif';
import seedsImage from '../../../assets/seeds.avif';
import eggsImage from '../../../assets/eggs.avif';
import juiceImage from '../../../assets/juice.avif';
import edibleImage from '../../../assets/edible.avif';
import bakeryImage from '../../../assets/bakery.avif';
import picklesImage from '../../../assets/pickles.avif';
import snacksImage from '../../../assets/snacks.avif';
import coffeeImage from '../../../assets/coffe.avif';
import dryfruitsImage from '../../../assets/dryfruits.avif';

const CATEGORIES = [
  { id: 'Vegetables', name: 'Vegetables', image: vegetableImage },
  { id: 'Fruits', name: 'Fruits', image: fruitsImage },
  { id: 'Grains', name: 'Grains', image: grainsImage },
  { id: 'Pulses', name: 'Pulses', image: pulsesImage },
  { id: 'Spices', name: 'Spices', image: spicesImage },
  { id: 'Nuts', name: 'Nuts', image: nutsImage },
  { id: 'Sugar', name: 'Sugar', image: sugarImage },
  { id: 'Seeds', name: 'Seeds', image: seedsImage },
  { id: 'Eggs', name: 'Eggs', image: eggsImage },
  { id: 'Beverages', name: 'Beverages', image: juiceImage },
  { id: 'Oil', name: 'Edible Oils', image: edibleImage },
  { id: 'Bakery', name: 'Bakery', image: bakeryImage },
  { id: 'Pickles', name: 'Pickles', image: picklesImage },
  { id: 'Snacks', name: 'Snacks', image: snacksImage },
  { id: 'Tea', name: 'Tea & Coffee', image: coffeeImage },
  { id: 'DryFruits', name: 'Dry Fruits', image: dryfruitsImage }
];

const UserMarketplace = () => {
  const { products, fetchAllProducts, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { fetchWishlist, toggleWishlist, isInWishlist } = useWishlistStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    fetchAllProducts();
    fetchWishlist();
  }, [fetchAllProducts, fetchWishlist]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const mapLocations = useMemo(() => {
    return filteredProducts
      .filter(p => p?.seller?.location?.coordinates?.length === 2)
      .map(p => ({
        lat: p.seller.location.coordinates[1],
        lng: p.seller.location.coordinates[0],
        title: p.name,
        description: `Price: ₹${p.price} • Seller: ${p.seller?.name || 'Unknown'}`
      }));
  }, [filteredProducts]);

  const handleCategoryClick = (category) => {
    setSearchParams({ category });
    setSearchTerm("");
  };

  const handleBackToCategories = () => {
    setSearchParams({});
    setSearchTerm("");
    setIsMapView(false);
  };

  const showProducts = Boolean(selectedCategory) || Boolean(searchTerm) || isMapView;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2B2B2B]">
            {selectedCategory ? `${selectedCategory} Market` : "Marketplace"}
          </h2>
          <p className="text-sm text-[#6A5746] mt-1">
            {selectedCategory
              ? `Browse fresh ${selectedCategory.toLowerCase()} from local farmers`
              : "Fresh produce directly from farmers"}
          </p>
        </div>

        {/* Search + Map Toggle */}
        <div className="flex gap-3 w-full md:w-auto items-center">
          {showProducts && (
            <button
              onClick={handleBackToCategories}
              className="p-2 text-[#6A5746] hover:text-[#FF8C42] flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline text-sm">Categories</span>
            </button>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#EAD7BD] bg-[#FFF6E9] focus:ring-2 focus:ring-[#FF8C42] outline-none"
            />
          </div>

          {showProducts && (
            <button
              onClick={() => setIsMapView(!isMapView)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center
                ${isMapView ? 'bg-[#FF8C42] text-white' : 'border border-[#EAD7BD] text-[#FF8C42] bg-transparent hover:bg-[#FFF4E6]'}`}
              title={isMapView ? "Switch to list" : "Show map"}
            >
              {isMapView ? <List size={18} /> : <MapIcon size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY GRID (OPTION A - Clean Image Cards) */}
      {!showProducts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer 
                         bg-[#FFF6E9] border border-[#EAD7BD] shadow-sm hover:shadow-md 
                         transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/12 group-hover:bg-black/28 transition-colors z-10" />

              <div className="absolute bottom-0 left-0 p-4 z-20 bg-gradient-to-t from-black/70 to-transparent w-full">
                <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-sm">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products or Map View */}
      {showProducts && (
        <>
          {isLoading ? (
            <div className="text-center py-20 text-[#6A5746]">Loading products...</div>
          ) : isMapView ? (
            <div className="rounded-xl overflow-hidden border border-[#EAD7BD] bg-[#FFF6E9] shadow-sm">
              <MapComponent locations={mapLocations} />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="rounded-xl overflow-hidden shadow-sm border border-[#EAD7BD] bg-[#FFF6E9] hover:shadow-md transition"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-full hover:bg-white z-20 transition"
                      title="Add to wishlist"
                    >
                      <Heart
                        size={18}
                        className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>

                    {product.stock < 10 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="max-w-[75%]">
                        <h3 className="font-bold text-lg text-[#2B2B2B]">{product.name}</h3>
                        <p className="text-xs text-[#6A5746]">{product.category}</p>
                      </div>

                      <span className="bg-[#FFF4E6] text-[#FF8C42] text-xs font-bold px-2 py-1 rounded-md">
                        {product.stock} left
                      </span>
                    </div>

                    <p className="text-[#6A5746] text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#8C2F2B]">₹{product.price}</span>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#FF8C42] text-white p-2 rounded-lg hover:bg-[#e67e3b] transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <ShoppingCart size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-[#EAD7BD] bg-[#FFF6E9]">
              <p className="text-[#6A5746] text-lg">No products found in this category.</p>
              <button
                onClick={handleBackToCategories}
                className="mt-4 text-[#FF8C42] font-bold hover:underline"
              >
                Browse all categories
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserMarketplace;
