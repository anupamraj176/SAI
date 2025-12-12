import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Map as MapIcon, List, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
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
  { id: 'Beverages', name: 'Juices & Beverages', image: juiceImage },
  { id: 'Oil', name: 'Edible Oils', image: edibleImage },
  { id: 'Bakery', name: 'Bakery Items', image: bakeryImage },
  { id: 'Pickles', name: 'Pickles & Homemade', image: picklesImage },
  { id: 'Snacks', name: 'Healthy Snacks', image: snacksImage },
  { id: 'Tea', name: 'Tea & Coffee', image: coffeeImage },
  { id: 'DryFruits', name: 'Dry Fruits', image: dryfruitsImage }
];

const UserMarketplace = () => {
  const { products, fetchAllProducts, isLoading } = useProductStore();
  const { addToCart } = useCartStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const [isMapView, setIsMapView] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Map Markers
  const mapLocations = useMemo(() => {
    return filteredProducts
      .filter(p => p?.seller?.location?.coordinates?.length === 2)
      .map(p => ({
        lat: p.seller.location.coordinates[1],
        lng: p.seller.location.coordinates[0],
        title: p.name,
        description: `Price: ₹${p.price} | Seller: ${p.seller.name}`
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

  const showProducts = selectedCategory || searchTerm || isMapView;

  // -----------------------
  // UI Rendering
  // -----------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <div>
          <h2 className="text-3xl font-bold text-[#2B2B2B]">
            {selectedCategory ? `${selectedCategory} Market` : "Marketplace"}
          </h2>
          <p className="text-gray-500">
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
              className="p-2 text-gray-600 hover:text-[#FF8C42] flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Categories</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#FFD9A0] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
            />
          </div>

          {/* Toggle Map/List */}
          {showProducts && (
            <button
              onClick={() => setIsMapView(!isMapView)}
              className={`p-2 border rounded-lg transition-colors 
                ${isMapView ? 'bg-[#FF8C42] text-white border-[#FF8C42]' 
                           : 'border-[#FFD9A0] text-[#FF8C42] hover:bg-[#FFF4E6]'}`}
            >
              {isMapView ? <List size={20} /> : <MapIcon size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Category Grid */}
      {!showProducts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer 
                         shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent w-full">
                <h3 className="text-white text-xl font-bold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products or Map View */}
      {showProducts && (
        <>
          {isLoading ? (
            <div className="text-center py-20 text-gray-500">
              Loading products...
            </div>
          ) : isMapView ? (
            <MapComponent locations={mapLocations} />
          ) : filteredProducts.length > 0 ? (
            /* Product Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-[#FFD9A0] shadow-sm overflow-hidden 
                           hover:shadow-md transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.stock < 10 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-[#2B2B2B]">{product.name}</h3>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <span className="bg-[#FFF4E6] text-[#FF8C42] text-xs font-bold px-2 py-1 rounded-md">
                        {product.stock} left
                      </span>
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
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
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
