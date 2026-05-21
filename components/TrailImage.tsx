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
      className="absolute top-0 left-0 pointer-events-none rounded-xl object-cover ring-2 ring-white/20"
      style={{
        x,
        y,
        width: 150,
        height: 150,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    />
  );
}
