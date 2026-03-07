/**
 * Returns Framer Motion props for scroll-triggered "blur-to-clear" reveal.
 * Text doesn't just fade — it unfolds from blurred+translated to crisp+positioned.
 * Pure utility (not a hook) so it can be called conditionally or in loops.
 */
export function scrollRevealProps(delay: number = 0) {
  return {
    initial: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
    },
    whileInView: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
    viewport: {
      once: true,
      margin: "-80px" as const,
    },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  };
}
