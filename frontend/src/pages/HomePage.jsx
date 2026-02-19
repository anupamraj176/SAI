import FarmerNavbar from "../components/FarmerNavbar";
import FloatingLeaves from "../components/FloatingLeaves";
import MangoTree from "../components/MangoTree";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Leaf, Sprout, ShoppingBag, Droplets, Sun, Wind, TreePine, Apple, Wheat, Carrot, Star, Award, TrendingUp, ArrowRight, Calendar, Users, Package, MapPin } from "lucide-react";

const HomePage = () => {
  // Sample data for sections
  const crops = [
    { name: "Rice", icon: Wheat, description: "Premium quality paddy rice sourced from local farms with guaranteed purity", season: "Kharif", yield: "4-6 tons/ha", grade: "A+" },
    { name: "Wheat", icon: Wheat, description: "Golden wheat grains, perfect for flour and wholesome bread", season: "Rabi", yield: "3-5 tons/ha", grade: "A" },
    { name: "Vegetables", icon: Carrot, description: "Fresh seasonal vegetables picked daily from certified organic farms", season: "All Year", yield: "10-15 tons/ha", grade: "A+" },
    { name: "Fruits", icon: Apple, description: "Organic certified fruits from partner orchards across India", season: "Seasonal", yield: "8-12 tons/ha", grade: "A" },
    { name: "Pulses", icon: Sprout, description: "Protein-rich lentils and beans for a healthy balanced diet", season: "Rabi", yield: "1-2 tons/ha", grade: "A" },
    { name: "Cotton", icon: Leaf, description: "High-grade organic cotton fiber for premium textiles", season: "Kharif", yield: "2-3 tons/ha", grade: "A+" },
  ];

  const fertilizers = [
    { name: "Organic Compost", type: "Organic", benefits: "Improves soil structure & water retention", price: "₹500/bag", bestSeller: true, rating: 4.8 },
    { name: "NPK Fertilizer", type: "Chemical", benefits: "Balanced N-P-K nutrition for all crops", price: "₹850/bag", bestSeller: false, rating: 4.5 },
    { name: "Vermicompost", type: "Organic", benefits: "Rich in micro-nutrients & enzymes", price: "₹400/bag", bestSeller: true, rating: 4.9 },
    { name: "Urea", type: "Nitrogen", benefits: "Promotes leaf growth & greening", price: "₹300/bag", bestSeller: false, rating: 4.3 },
    { name: "Bone Meal", type: "Organic", benefits: "High phosphorus for root development", price: "₹600/bag", bestSeller: false, rating: 4.6 },
    { name: "Potash", type: "Potassium", benefits: "Boosts fruit quality & disease resistance", price: "₹450/bag", bestSeller: false, rating: 4.4 },
  ];

  const marketItems = [
    { category: "Fresh Produce", items: "Vegetables, Fruits, Herbs", sellers: "120+ farmers", products: "450+", icon: Carrot },
    { category: "Grains & Cereals", items: "Rice, Wheat, Millets", sellers: "85+ farmers", products: "280+", icon: Wheat },
    { category: "Dairy Products", items: "Milk, Cheese, Butter", sellers: "45+ farmers", products: "150+", icon: Droplets },
    { category: "Spices", items: "Turmeric, Chili, Cumin", sellers: "60+ farmers", products: "320+", icon: Leaf },
  ];

  return (
    <>
      <FarmerNavbar />

      <section className="relative h-screen flex items-center justify-center overflow-hidden 
        bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7]">
        
        <FloatingLeaves />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="grid max-w-7xl px-6 py-16 md:grid-cols-2 md:items-center gap-10 relative z-10"
        >
          {/* LEFT CONTENT (unchanged) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-prose space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-[#1F3326]">
              Cultivating Growth and{" "}
              <span className="bg-gradient-to-r from-[#347B66] to-[#CFF56E] bg-clip-text text-transparent">
                Sustainable
              </span>{" "}
              Harvests
            </h1>

            <p className="text-lg text-[#3B4A38]/90">
              Empowering farmers with direct consumer access—bringing fresh,
              organic, and locally grown produce straight to your home.
            </p>

            <div className="flex gap-5 mt-8">
              <a
                href="#"
                className="rounded-xl bg-[#347B66] px-6 py-3 text-white font-semibold shadow-lg 
                hover:bg-[#6FA99F] transition-all"
              >
                🌿 Shop Produce
              </a>

              <a
                href="#"
                className="rounded-xl border border-[#347B66] px-6 py-3 text-[#1F3326] 
                font-semibold shadow-md hover:bg-[#347B66] hover:text-white transition-all"
              >
                🌳 Meet Farmers
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE – TREE EXACT ORIGINAL POSITION (only hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[600px] h-[900px] ml-10 overflow-hidden hidden md:block"
          >
            <Canvas camera={{ position: [10, 0, 10] }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 2]} intensity={1.5} />

              <Suspense fallback={null}>
                <motion.group
                  animate={{ y: [0, 0.2, 0], rotateY: [0, 0.05, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <MangoTree />
                </motion.group>

                <Environment preset="sunset" />
              </Suspense>

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={1.0}
              />
            </Canvas>
          </motion.div>

        </motion.div>
      </section>

      {/* CROPS SECTION */}
      <section id="crops" className="py-24 bg-[#E8F5E9] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8E6C9] rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CFF56E] rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-[#347B66]/10 text-[#347B66] rounded-full text-sm font-semibold mb-4">
              🌱 Farm Fresh
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F3326] mb-4">
              Our Premium Crops
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Discover a variety of fresh, sustainably grown crops directly from local farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crops.map((crop, index) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl p-7 shadow-md border border-[#6FA99F]/20 hover:shadow-2xl hover:border-[#347B66]/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl group-hover:from-[#347B66] group-hover:to-[#1F3326] transition-all duration-300 shadow-sm">
                    <crop.icon className="text-[#347B66] group-hover:text-white transition-colors duration-300" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1F3326] group-hover:text-[#347B66] transition-colors">{crop.name}</h3>
                    <p className="text-[#3B4A38]/80 text-sm mt-1.5 leading-relaxed">{crop.description}</p>

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#CFF56E]/60 text-[#1F3326] px-3 py-1.5 rounded-full">
                        <Calendar size={12} />
                        {crop.season} Season
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#347B66]/10 text-[#347B66] px-3 py-1.5 rounded-full">
                        <Award size={12} />
                        Grade {crop.grade}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E8F5E9] flex items-center justify-between">
                      <span className="text-xs text-[#3B4A38]/60 flex items-center gap-1">
                        <TrendingUp size={12} />
                        Yield: {crop.yield}
                      </span>
                      <span className="text-sm font-semibold text-[#347B66] group-hover:text-[#1F3326] flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Learn More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FERTILIZERS SECTION */}
      <section id="fertilizers" className="py-24 bg-gradient-to-b from-[#C8E6C9] to-[#E8F5E9] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#347B66] rounded-full blur-[200px] opacity-5 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-[#347B66]/10 text-[#347B66] rounded-full text-sm font-semibold mb-4">
              💧 Soil Nutrition
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F3326] mb-4">
              Fertilizers & Nutrients
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Quality fertilizers to boost your crop yield and soil health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fertilizers.map((item, index) => {
              const typeColors = {
                'Organic': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'from-emerald-400 to-green-500' },
                'Chemical': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'from-amber-400 to-orange-500' },
                'Nitrogen': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'from-blue-400 to-cyan-500' },
                'Potassium': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', bar: 'from-purple-400 to-pink-500' },
              };
              const colors = typeColors[item.type] || typeColors['Organic'];

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#6FA99F]/20 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${colors.bar}`} />

                  <div className="p-7">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#1F3326] group-hover:text-[#347B66] transition-colors">{item.name}</h3>
                        {item.bestSeller && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-[#CFF56E] text-[#1F3326] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                            <Award size={10} /> Best Seller
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="text-[#3B4A38]/80 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#347B66] flex-shrink-0" />
                      {item.benefits}
                    </p>

                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className={i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                      <span className="text-xs text-[#3B4A38]/60 ml-1">{item.rating}</span>
                    </div>

                    <div className="flex justify-between items-end mt-6 pt-5 border-t border-[#E8F5E9]">
                      <div>
                        <span className="text-xs text-[#3B4A38]/50 block">Price</span>
                        <span className="text-2xl font-extrabold text-[#347B66]">{item.price}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-[#347B66] text-white rounded-xl hover:bg-[#1F3326] transition-colors text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARKET SECTION */}
      <section id="market" className="py-24 bg-[#E8F5E9] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CFF56E] rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#347B66] rounded-full blur-3xl opacity-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-[#347B66]/10 text-[#347B66] rounded-full text-sm font-semibold mb-4">
              🛒 Marketplace
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F3326] mb-4">
              Farmer's Market
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Browse our marketplace connecting you directly with local farmers
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          >
            {[
              { label: "Active Farmers", value: "310+", icon: Users },
              { label: "Products Listed", value: "1,200+", icon: Package },
              { label: "Daily Orders", value: "500+", icon: ShoppingBag },
              { label: "Cities Served", value: "50+", icon: MapPin },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 text-center border border-[#6FA99F]/20 shadow-sm hover:shadow-md transition-all"
              >
                <stat.icon className="mx-auto text-[#347B66] mb-2" size={24} />
                <h4 className="text-2xl font-extrabold text-[#347B66]">{stat.value}</h4>
                <p className="text-xs text-[#3B4A38]/60 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketItems.map((market, index) => (
              <motion.div
                key={market.category}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative bg-gradient-to-br from-[#347B66] via-[#2A6555] to-[#1F3326] rounded-3xl p-8 text-white shadow-xl overflow-hidden group cursor-pointer"
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <market.icon className="text-[#CFF56E]" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-[#CFF56E] transition-colors">{market.category}</h3>
                  </div>
                  <p className="text-[#C8E6C9]/80 mb-6 text-sm">{market.items}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#CFF56E] animate-pulse" />
                        <span className="text-[#CFF56E] font-semibold text-sm">{market.sellers}</span>
                      </div>
                      <span className="text-white/40">|</span>
                      <span className="text-[#C8E6C9]/60 text-sm">{market.products} products</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-[#CFF56E] text-[#1F3326] rounded-xl hover:bg-white transition-colors font-bold text-sm shadow-lg"
                    >
                      Explore →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-3xl p-10 shadow-lg border border-[#6FA99F]/20 text-center relative overflow-hidden"
          >
            <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#CFF56E] rounded-full blur-3xl opacity-20" />
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#347B66] rounded-full blur-3xl opacity-10" />

            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-[#1F3326] mb-3">Ready to start selling?</h3>
              <p className="text-[#3B4A38] mb-8 max-w-lg mx-auto">Join thousands of farmers already growing their business with FarmerHub</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="/signup" className="px-8 py-3.5 bg-[#347B66] text-white rounded-xl font-semibold hover:bg-[#1F3326] transition-colors shadow-md hover:shadow-lg">
                  Register as Farmer
                </a>
                <a href="/login" className="px-8 py-3.5 border-2 border-[#347B66] text-[#347B66] rounded-xl font-semibold hover:bg-[#347B66] hover:text-white transition-colors">
                  Login to Dashboard
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1F3326] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-[#CFF56E]">FarmerHub</h4>
              <p className="text-[#C8E6C9] text-sm">Connecting farmers directly to consumers for fresh, sustainable produce.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-3 text-[#CFF56E]">Quick Links</h5>
              <ul className="space-y-2 text-sm text-[#C8E6C9]">
                <li><a href="/#crops" className="hover:text-white transition-colors">Crops</a></li>
                <li><a href="/#fertilizers" className="hover:text-white transition-colors">Fertilizers</a></li>
                <li><a href="/#market" className="hover:text-white transition-colors">Market</a></li>
                <li><a href="/education" className="hover:text-white transition-colors">Education</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3 text-[#CFF56E]">Support</h5>
              <ul className="space-y-2 text-sm text-[#C8E6C9]">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3 text-[#CFF56E]">Contact</h5>
              <ul className="space-y-2 text-sm text-[#C8E6C9]">
                <li>support@farmerhub.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#347B66] mt-8 pt-8 text-center text-sm text-[#6FA99F]">
            © 2024 FarmerHub. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
