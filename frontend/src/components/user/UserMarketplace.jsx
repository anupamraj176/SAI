import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Map as MapIcon, List } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import MapComponent from '../MapComponent';

const UserMarketplace = () => {
  const { products, fetchAllProducts, isLoading } = useProductStore(); // Get fetchAllProducts
  const { addToCart } = useCartStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMapView, setIsMapView] = useState(false);

  // ✅ FIX: Fetch products when component mounts
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Seeds", "Fertilizers"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const mapLocations = filteredProducts
    .filter(p => p.seller && p.seller.location && p.seller.location.coordinates && p.seller.location.coordinates.length === 2)
    .map(p => ({
        lat: p.seller.location.coordinates[1],
        lng: p.seller.location.coordinates[0],
        title: p.name,
        description: `Price: ₹${p.price} | Seller: ${p.seller.name}`
    }));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2B2B2B]">Marketplace</h2>
          <p className="text-gray-500">Fresh produce directly from farmers</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#FFD9A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-[#FFD9A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] appearance-none bg-white cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsMapView(!isMapView)}
            className="p-2 border border-[#FFD9A0] rounded-lg hover:bg-[#FFF4E6] text-[#FF8C42] transition-colors bg-white"
            title={isMapView ? "Switch to List View" : "Switch to Map View"}
          >
            {isMapView ? <List size={20} /> : <MapIcon size={20} />}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading products...</div>
      ) : isMapView ? (
        <MapComponent locations={mapLocations} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-[#FFD9A0] overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                {product.stock < 10 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
              
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
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#8C2F2B]">₹{product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-[#FF8C42] text-white p-2 rounded-lg hover:bg-[#e67e3b] transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <ShoppingCart size={18} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(""); setSelectedCategory("All")}}
            className="mt-4 text-[#FF8C42] font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMarketplace;
