import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const FloatingLeaves = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    // Only access window on client side
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const leaves = Array.from({ length: 15 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((_, i) => {
        const size = Math.random() * 15 + 20;
        const startX = Math.random() * dimensions.width;
        const endX = Math.random() * dimensions.width;
        
        return (
          <motion.img
            key={i}
            src="/assets/leaf.png"
            alt=""
            className="absolute opacity-70"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            initial={{ x: startX, y: -50, rotate: 0 }}
            animate={{
              y: [-50, dimensions.height + 50],
              rotate: [0, 360],
              x: [startX, endX],
              opacity: [0.7, 0.9, 0.6],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingLeaves;
