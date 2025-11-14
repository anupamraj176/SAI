"use client";
import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MangoTree = () => {
  const { scene } = useGLTF("/models/mango_tree.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      // prevent issues with single-sided materials
      child.material.side = THREE.DoubleSide;
    }
  });

  return <primitive object={scene} scale={1.5} position={[0, -5, 0]} />;
};

useGLTF.preload("/models/mango_tree.glb");

export default MangoTree;
