"use client";

import FeaturedWork from "@/components/sections/FeaturedWork";
import Image from "next/image";
import { motion } from "framer-motion";
import { scrollRevealProps } from "@/hooks/scrollReveal";

export default function WorkPage() {
  return (
    <div className="pt-28">
      <FeaturedWork />

      {/* ── Philosophy signature — photo8 ── */}
      <section className="relative mx-auto max-w-[900px] px-6 py-24 overflow-hidden">
        {/* Background image — melt-into-paper */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/photo8.png"
            alt=""
            fill
            className="object-cover melt-mask opacity-[0.12] md:opacity-[0.16]"
            sizes="900px"
          />
        </div>

        <motion.div {...scrollRevealProps(0)} className="relative z-[1] text-center">
          <p className="text-[13px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
            Philosophy
          </p>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] leading-[1.12] mb-4">
            Design is not decoration.
            <br />
            It&apos;s how learning works.
          </h2>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto leading-[1.6]">
            Every project starts with a question about the learner &mdash;
            not the content. The design follows.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
