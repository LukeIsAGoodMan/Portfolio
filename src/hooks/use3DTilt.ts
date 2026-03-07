import { useRef, useCallback } from "react";
import {
  useMotionValue,
  useSpring,
  type MotionStyle,
} from "framer-motion";

/**
 * Creates a 3D perspective-tilt effect driven by mouse position.
 * Returns a ref to attach, motion styles, and event handlers.
 * Motion logic is fully decoupled from rendering.
 */
export function use3DTilt(maxTilt: number = 6) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(rawX, springConfig);
  const rotateY = useSpring(rawY, springConfig);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(-ny * maxTilt);
      rawY.set(nx * maxTilt);
    },
    [maxTilt, rawX, rawY],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const style: MotionStyle = {
    rotateX,
    rotateY,
    transformPerspective: 800,
  };

  return { ref, style, handlers: { onMouseMove, onMouseLeave } };
}
