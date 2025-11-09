import React from "react";
import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay, duration = 10, blur = "blur-2xl", opacity = "opacity-30" }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${size} ${color} ${opacity} ${blur} z-0`}
      style={{ top, left, filter: "blur(80px)" }}
      animate={{
        y: ["0%", "20%", "0%"],
        x: ["0%", "10%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
