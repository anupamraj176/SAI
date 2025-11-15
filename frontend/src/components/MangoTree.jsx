"use client";
import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MangoTree = () => {
  const { scene } = useGLTF("/models/mango_tree.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
      child.material.emissive = new THREE.Color("#ffb06b");
      child.material.emissiveIntensity = 0.03;
    }
  });

  return <primitive object={scene} scale={1.5} position={[0, -5, 0]} />;
};

useGLTF.preload("/models/mango_tree.glb");

export default MangoTree;
