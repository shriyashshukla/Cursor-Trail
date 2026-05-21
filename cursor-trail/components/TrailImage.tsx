"use client";

import { motion } from "motion/react";

type TrailImageProps = {
  x: number;
  y: number;
  src: string;
};

export default function TrailImage({ x, y, src }: TrailImageProps) {
  return (
    <motion.img
      src={src}
      alt="trail"
      className="fixed top-0 left-0 pointer-events-none rounded-xl object-cover ring-2 ring-white/20"
      style={{
        x,
        y,
        width: 120,
        height: 120,
        translateX: "-70%",
        translateY: "-70%",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, scale: 1.0, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.4, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    />
  );
}
