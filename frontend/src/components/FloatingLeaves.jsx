"use client";
import { motion } from "framer-motion";
import React from "react";

const FloatingLeaves = () => {
  const leaves = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((_, i) => (
        <motion.img
          key={i}
          src="/assets/leaf.png"
          alt="Leaf"
          className="absolute opacity-70"
          style={{
            width: `${Math.random() * 15 + 20}px`,
            height: `${Math.random() * 15 + 20}px`,
          }}
          initial={{ x: Math.random() * window.innerWidth, y: -50, rotate: 0 }}
          animate={{
            y: [-50, window.innerHeight + 50],
            rotate: [0, 360],
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
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

export default FloatingLeaves;
