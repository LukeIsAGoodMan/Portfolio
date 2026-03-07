"use client";

import { motion } from "framer-motion";
import { useCursorTracker } from "@/hooks/useCursorTracker";

/**
 * Custom cursor that follows the mouse with spring physics.
 * Expands when hovering interactive elements.
 * Uses mix-blend-mode: difference for that high-end design feel.
 * Only renders on devices with a fine pointer (mouse/trackpad).
 */
export default function MagneticCursor() {
  const { x, y, isHovering, isVisible } = useCursorTracker();

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-white mix-blend-difference"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isHovering ? 52 : 14,
        height: isHovering ? 52 : 14,
        opacity: isHovering ? 0.9 : 0.7,
      }}
      transition={{
        width: { type: "spring", damping: 22, stiffness: 350 },
        height: { type: "spring", damping: 22, stiffness: 350 },
        opacity: { duration: 0.2 },
      }}
    />
  );
}
