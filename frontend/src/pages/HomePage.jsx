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

      <section className="bg-[#FFD9A0] relative h-screen flex items-center justify-center overflow-hidden">
        <FloatingLeaves />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid max-w-7xl px-6 py-16 md:grid-cols-2 md:items-center gap-10 relative z-10"
        >
          <div className="max-w-prose space-y-5">
            <h1 className="text-5xl font-extrabold text-[#8C2F2B] leading-tight sm:text-6xl">
              Cultivating Growth and{" "}
              <span className="text-[#FF8C42]">Sustainable</span> Harvests
            </h1>

            <p className="text-lg text-[#2B2B2B]/90 leading-relaxed">
              We connect farmers directly with consumers, offering fresh,
              locally-sourced produce for a healthier planet.
            </p>

            <div className="flex gap-5 mt-8">
              <a
                href="#"
                className="rounded-xl bg-[#C24C30] px-6 py-3 text-white font-semibold shadow-md hover:bg-[#E66A32] transition-all"
              >
                🌿 Shop Produce
              </a>
              <a
                href="#"
                className="rounded-xl border border-[#FF8C42] px-6 py-3 text-[#8C2F2B] font-semibold shadow-md hover:bg-[#FF8C42] hover:text-white transition-all"
              >
                🌳 Meet Our Farmers
              </a>
            </div>
          </div>

          {/* RIGHT 3D MODEL */}
          <div className="w-[600px] h-[900px] ml-10 overflow-hidden">
            <Canvas camera={{ position: [10, 0, 10] }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 2]} intensity={1.5} />

              <Suspense fallback={null}>
                <MangoTree />
                <Environment preset="sunset" />
              </Suspense>

              <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
