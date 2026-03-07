import { useCallback } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";

/**
 * "Jelly Stretch" hover effect (Gloria Ha style).
 * On hover-in the element stretches on X and compresses on Y,
 * then springs back with a satisfying organic bounce.
 * Returns motion styles + hover event handlers.
 */
export function useJellyStretch() {
  const hover = useMotionValue(0);

  // Low damping + high stiffness = visible jelly overshoot
  const spring = useSpring(hover, { damping: 12, stiffness: 400, mass: 0.5 });

  const scaleX = useTransform(spring, [0, 0.5, 1], [1, 1.08, 1.04]);
  const scaleY = useTransform(spring, [0, 0.5, 1], [1, 0.94, 0.97]);

  const onHoverStart = useCallback(() => hover.set(1), [hover]);
  const onHoverEnd = useCallback(() => hover.set(0), [hover]);

  return {
    style: { scaleX, scaleY } as MotionStyle,
    onHoverStart,
    onHoverEnd,
  };
}
