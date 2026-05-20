"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const TRAIL_COUNT = 12;

export default function CursorTrail() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [trail, setTrail] = useState(
    Array(TRAIL_COUNT).fill({
      x: 0,
      y: 0,
    })
  );

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail];

        newTrail[0] = mousePosition;

        for (let i = 1; i < TRAIL_COUNT; i++) {
          newTrail[i] = {
            x:
              newTrail[i].x +
              (newTrail[i - 1].x - newTrail[i].x) * 0.35,

            y:
              newTrail[i].y +
              (newTrail[i - 1].y - newTrail[i].y) * 0.35,
          };
        }

        return [...newTrail];
      });
    }, 16);

    return () => clearInterval(interval);
  }, [mousePosition]);

  return (
    <>
      {trail.map((item, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 rounded-full bg-blue-500 pointer-events-none" 
          animate={{
            x: item.x - 10,
            y: item.y - 10,
            scale: (TRAIL_COUNT - index) / TRAIL_COUNT,
            opacity: (TRAIL_COUNT - index) / TRAIL_COUNT,
          }}
          transition={{
            duration: 0.1,
          }}
          style={{
            width: "20px",
            height: "20px",
          }}
        />
      ))}
    </>
  );
}