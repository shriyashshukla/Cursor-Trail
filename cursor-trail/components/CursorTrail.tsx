"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 14;
const EASE = 0.22;
const IMAGE_SRC = "/cursor-trail.svg";

type Point = {
  x: number;
  y: number;
};

function createTrail() {
  return Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));
}

export default function CursorTrail() {
  const [trail, setTrail] = useState<Point[]>(createTrail());
  const mousePosition = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTrail((previous) => {
        const next = [...previous];
        next[0] = { ...mousePosition.current };

        for (let i = 1; i < TRAIL_COUNT; i += 1) {
          next[i] = {
            x: next[i].x + (next[i - 1].x - next[i].x) * EASE,
            y: next[i].y + (next[i - 1].y - next[i].y) * EASE,
          };
        }

        return next;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      {trail.map((point, index) => {
        const intensity = (TRAIL_COUNT - index) / TRAIL_COUNT;
        const size = 18 + index * 1.4;

        return (
          <motion.img
            key={index}
            src={IMAGE_SRC}
            alt=""
            className="fixed top-0 left-0 pointer-events-none"
            animate={{
              x: point.x - size / 2,
              y: point.y - size / 2,
              scale: 0.6 + intensity * 0.8,
              opacity: Math.pow(intensity, 1.6),
              rotate: index % 2 === 0 ? 6 : -6,
            }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 170,
              duration: 0.16,
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              filter: "drop-shadow(0 0 22px rgba(56, 189, 248, 0.45))",
            }}
          />
        );
      })}
    </>
  );
}
