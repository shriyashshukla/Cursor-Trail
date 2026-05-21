"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import TrailImage from "./TrailImage";

const IMAGES = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/7.jpeg",
  "/images/8.jpeg",
  "/images/9.jpeg",
];

type TrailItem = {
  id: string;
  x: number;
  y: number;
  src: string;
};

export default function CursorTrail() {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPoint = useRef({ x: -100, y: -100 });
  const nextImageIndex = useRef(0);
  const nextId = useRef(0);
  const cleanupTimeouts = useRef<number[]>([]);

  const DISTANCE_THRESHOLD = 100;
  const SPAWN_LIFETIME = 900;

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance < DISTANCE_THRESHOLD) return;

      lastPoint.current = { x, y };
      const id = String(nextId.current++);
      const src = IMAGES[nextImageIndex.current];
      nextImageIndex.current = (nextImageIndex.current + 1) % IMAGES.length;

      setTrail((current) => [...current, { id, x, y, src }]);

      const timeoutId = window.setTimeout(() => {
        setTrail((current) => current.filter((item) => item.id !== id));
      }, SPAWN_LIFETIME);

      cleanupTimeouts.current.push(timeoutId);
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cleanupTimeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <AnimatePresence>
      {trail.map((item) => (
        <TrailImage key={item.id} x={item.x} y={item.y} src={item.src} />
      ))}
    </AnimatePresence>
  );
}
