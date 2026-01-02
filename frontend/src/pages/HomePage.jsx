"use client";
import FarmerNavbar from "../components/FarmerNavbar";
import FloatingLeaves from "../components/FloatingLeaves";
import MangoTree from "../components/MangoTree";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Leaf, Sprout, ShoppingBag, Droplets, Sun, Wind, TreePine, Apple, Wheat, Carrot } from "lucide-react";

const HomePage = () => {
  // Sample data for sections
  const crops = [
    { name: "Rice", icon: Wheat, description: "Premium quality paddy rice", season: "Kharif" },
    { name: "Wheat", icon: Wheat, description: "Golden wheat grains", season: "Rabi" },
    { name: "Vegetables", icon: Carrot, description: "Fresh seasonal vegetables", season: "All Year" },
    { name: "Fruits", icon: Apple, description: "Organic fruits from farms", season: "Seasonal" },
    { name: "Pulses", icon: Sprout, description: "Protein-rich lentils", season: "Rabi" },
    { name: "Cotton", icon: Leaf, description: "High-grade cotton", season: "Kharif" },
  ];

  const fertilizers = [
    { name: "Organic Compost", type: "Organic", benefits: "Improves soil structure", price: "₹500/bag" },
    { name: "NPK Fertilizer", type: "Chemical", benefits: "Balanced nutrition", price: "₹850/bag" },
    { name: "Vermicompost", type: "Organic", benefits: "Rich in nutrients", price: "₹400/bag" },
    { name: "Urea", type: "Nitrogen", benefits: "Promotes leaf growth", price: "₹300/bag" },
    { name: "Bone Meal", type: "Organic", benefits: "High phosphorus", price: "₹600/bag" },
    { name: "Potash", type: "Potassium", benefits: "Fruit development", price: "₹450/bag" },
  ];

  const marketItems = [
    { category: "Fresh Produce", items: "Vegetables, Fruits, Herbs", sellers: "120+ farmers" },
    { category: "Grains & Cereals", items: "Rice, Wheat, Millets", sellers: "85+ farmers" },
    { category: "Dairy Products", items: "Milk, Cheese, Butter", sellers: "45+ farmers" },
    { category: "Spices", items: "Turmeric, Chili, Cumin", sellers: "60+ farmers" },
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
      <section id="crops" className="py-20 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1F3326] mb-4 flex items-center justify-center gap-3">
              <Sprout className="text-[#347B66]" size={40} />
              Our Crops
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Discover a variety of fresh, sustainably grown crops directly from local farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop, index) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md border border-[#6FA99F]/30 hover:shadow-lg hover:border-[#347B66] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C8E6C9] rounded-xl group-hover:bg-[#347B66] transition-colors">
                    <crop.icon className="text-[#347B66] group-hover:text-white transition-colors" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1F3326]">{crop.name}</h3>
                    <p className="text-[#3B4A38] text-sm mt-1">{crop.description}</p>
                    <span className="inline-block mt-2 text-xs font-medium bg-[#CFF56E] text-[#1F3326] px-3 py-1 rounded-full">
                      {crop.season} Season
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FERTILIZERS SECTION */}
      <section id="fertilizers" className="py-20 bg-gradient-to-b from-[#C8E6C9] to-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1F3326] mb-4 flex items-center justify-center gap-3">
              <Droplets className="text-[#347B66]" size={40} />
              Fertilizers & Nutrients
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Quality fertilizers to boost your crop yield and soil health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fertilizers.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md border border-[#6FA99F]/30 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#1F3326]">{item.name}</h3>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    item.type === 'Organic' ? 'bg-[#C8E6C9] text-[#347B66]' : 'bg-[#CFF56E] text-[#1F3326]'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-[#3B4A38] text-sm mb-4">{item.benefits}</p>
                <div className="flex justify-between items-center pt-4 border-t border-[#6FA99F]/30">
                  <span className="text-2xl font-bold text-[#347B66]">{item.price}</span>
                  <button className="px-4 py-2 bg-[#347B66] text-white rounded-lg hover:bg-[#1F3326] transition-colors text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET SECTION */}
      <section id="market" className="py-20 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1F3326] mb-4 flex items-center justify-center gap-3">
              <ShoppingBag className="text-[#347B66]" size={40} />
              Farmer's Market
            </h2>
            <p className="text-[#3B4A38] text-lg max-w-2xl mx-auto">
              Browse our marketplace connecting you directly with local farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketItems.map((market, index) => (
              <motion.div
                key={market.category}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#347B66] to-[#1F3326] rounded-2xl p-8 text-white shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-3">{market.category}</h3>
                <p className="text-[#C8E6C9] mb-4">{market.items}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#CFF56E] font-medium">{market.sellers}</span>
                  <button className="px-5 py-2 bg-[#CFF56E] text-[#1F3326] rounded-lg hover:bg-white transition-colors font-semibold">
                    Explore →
                  </button>
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
            className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-[#6FA99F]/30 text-center"
          >
            <h3 className="text-2xl font-bold text-[#1F3326] mb-3">Ready to start selling?</h3>
            <p className="text-[#3B4A38] mb-6">Join thousands of farmers already growing their business with FarmerHub</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/signup" className="px-6 py-3 bg-[#347B66] text-white rounded-xl font-semibold hover:bg-[#1F3326] transition-colors">
                Register as Farmer
              </a>
              <a href="/login" className="px-6 py-3 border-2 border-[#347B66] text-[#347B66] rounded-xl font-semibold hover:bg-[#347B66] hover:text-white transition-colors">
                Login to Dashboard
              </a>
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
