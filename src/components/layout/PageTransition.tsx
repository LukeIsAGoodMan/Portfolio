"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

/**
 * Wraps page content with AnimatePresence for Apple-style
 * fade + slide + blur transitions between routes.
 * Uses pathname as the motion key so route changes trigger
 * exit → enter animation cycle.
 */
export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(3px)" }}
        transition={{
          duration: 0.35,
          ease: EASE_EXPO,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
