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

type CursorTrailProps = {
  targetId: string;
};

export default function CursorTrail({ targetId }: CursorTrailProps) {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPoint = useRef({ x: -100, y: -100 });
  const lastWheelSpawn = useRef(0);
  const nextImageIndex = useRef(0);
  const nextId = useRef(0);
  const cleanupTimeouts = useRef<number[]>([]);
  const sectionVisible = useRef(false);

  const DISTANCE_THRESHOLD = 120;
  const WHEEL_SPAWN_INTERVAL = 180;
  const SPAWN_LIFETIME = 1200;

  const spawnTrail = (x: number, y: number) => {
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

  const normalizePoint = (e: { clientX: number; clientY: number }, rect: DOMRect) => ({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });

  useEffect(() => {
    const container = document.getElementById(targetId);
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionVisible.current = entry.isIntersecting;
        if (!sectionVisible.current) {
          setTrail([]);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    const handleMove = (e: PointerEvent) => {
      if (!sectionVisible.current) return;
      const rect = container.getBoundingClientRect();
      const { x, y } = normalizePoint(e, rect);
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance < DISTANCE_THRESHOLD) return;
      spawnTrail(x, y);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!sectionVisible.current) return;
      const now = performance.now();
      if (now - lastWheelSpawn.current < WHEEL_SPAWN_INTERVAL) return;
      lastWheelSpawn.current = now;

      const rect = container.getBoundingClientRect();
      const { x, y } = normalizePoint(e, rect);
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      spawnTrail(x, y);
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("wheel", handleWheel);
      cleanupTimeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, [targetId]);

  return (
    <AnimatePresence>
      {trail.map((item) => (
        <TrailImage key={item.id} x={item.x} y={item.y} src={item.src} />
      ))}
    </AnimatePresence>
  );
}
