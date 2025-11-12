"use client";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import FarmerNavbar from "./FarmerNavbar";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

// 🍃 Floating leaf animation component
const FloatingLeaves = () => {
  const leaves = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((_, i) => (
        <motion.img
          key={i}
          src="../assets/leaf.png"
          alt="Leaf"
          className="absolute opacity-70"
          style={{
            width: `${Math.random() * 15 + 20}px`,
            height: `${Math.random() * 15 + 20}px`,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0,
          }}
          animate={{
            y: [-50, window.innerHeight + 50],
            rotate: [0, 360],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            opacity: [0.7, 0.9, 0.6],
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// 🌳 Mango Tree 3D model loader (✅ reverted to original lighting)
const MangoTree = () => {
  const { scene } = useGLTF("/models/mango_tree.glb");

  // Keep original properties (no tone mapping changes)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
    }
  });

  // ✅ same as your original scale & position
  return <primitive object={scene} scale={1.5} position={[0, -5, 0]} />;
};

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <FarmerNavbar onLogout={handleLogout} user={user} />

      <section className="bg-[#FFD9A0] relative h-screen flex items-center justify-center overflow-hidden">
        <FloatingLeaves />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid max-w-7xl px-6 py-16 md:grid-cols-2 md:items-center gap-10 relative z-10"
        >
          {/* 🌱 Left Section */}
          <div className="max-w-prose space-y-5">
            <h1 className="text-5xl font-extrabold text-[#8C2F2B] leading-tight sm:text-6xl">
              Cultivating Growth and{" "}
              <span className="text-[#FF8C42]">Sustainable</span> Harvests
            </h1>
            <p className="text-lg text-[#2B2B2B]/90 leading-relaxed">
              We connect farmers directly with consumers, offering fresh,
              locally-sourced produce while ensuring fair practices and soil
              health for a better tomorrow.
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

          {/* 🌳 Right Section (✅ original view restored) */}
          <div className="w-[600px] h-[900px] ml-10 overflow-hidden">
            <Canvas
              camera={{ position: [10, 0, 10] }}
              gl={{ physicallyCorrectLights: true }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 2]} intensity={1.5} />

              <Suspense fallback={null}>
                <MangoTree />
                <Environment preset="sunset" />
              </Suspense>

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.8}
              />
            </Canvas>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Dashboard;

// ✅ Preload model
useGLTF.preload("/models/mango_tree.glb");
