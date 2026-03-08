"use client";

import Hero from "@/components/sections/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Quick Preview CTA — bridge to /work */}
      <section className="mx-auto max-w-[1200px] px-6 py-32 text-center">
        <motion.div {...scrollRevealProps(0)}>
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            Portfolio
          </p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            Projects that shaped
            <br />
            how people learn.
          </h2>
          <p className="text-muted text-[15px] max-w-[420px] mx-auto leading-[1.6] mb-10">
            From AI-powered adaptive platforms to immersive VR
            labs&mdash;explore the work.
          </p>
          <Link
            href="/work"
            data-magnetic
            className="
              inline-flex items-center gap-2 px-7 py-3.5
              bg-foreground text-background
              text-[13px] font-medium tracking-[0.01em]
              rounded-full
              transition-transform duration-300
              hover:scale-[1.04] active:scale-[0.98]
            "
          >
            View All Projects
            <span aria-hidden="true" className="text-[16px]">&rarr;</span>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
