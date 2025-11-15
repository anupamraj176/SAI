"use client";
import FarmerNavbar from "../components/FarmerNavbar";
import FloatingLeaves from "../components/FloatingLeaves";
import MangoTree from "../components/MangoTree";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <>
      <FarmerNavbar />

      <section className="relative h-screen flex items-center justify-center overflow-hidden 
        bg-gradient-to-br from-[#FFE7C6] via-[#FFD2A1] to-[#FFB478]">
        
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
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-[#7A1E1A]">
              Cultivating Growth and{" "}
              <span className="bg-gradient-to-r from-[#FF9540] to-[#FF7A2E] bg-clip-text text-transparent">
                Sustainable
              </span>{" "}
              Harvests
            </h1>

            <p className="text-lg text-[#3A3A3A]/90">
              Empowering farmers with direct consumer access—bringing fresh,
              organic, and locally grown produce straight to your home.
            </p>

            <div className="flex gap-5 mt-8">
              <a
                href="#"
                className="rounded-xl bg-[#C24C30] px-6 py-3 text-white font-semibold shadow-lg 
                hover:bg-[#E66A32] transition-all"
              >
                🌿 Shop Produce
              </a>

              <a
                href="#"
                className="rounded-xl border border-[#FF8C42] px-6 py-3 text-[#7A1E1A] 
                font-semibold shadow-md hover:bg-[#FF8C42] hover:text-white transition-all"
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
    </>
  );
};

export default HomePage;
