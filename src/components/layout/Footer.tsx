"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollRevealProps } from "@/hooks/scrollReveal";

/* ─────────────────────────────────────────────
 * Footer — "Apple Report" style
 *
 * Massive philosophy statement, professional
 * tagline, minimal functional links, copyright.
 * ───────────────────────────────────────────── */

const linkDefs = [
  { key: "linkedin", href: "https://linkedin.com/in/zheyu-wu", external: true },
  { key: "email", href: "mailto:zheyu8@ualberta.ca", external: false },
  { key: "resume", href: "/about", external: false },
];

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="pt-32 md:pt-48 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* ── Hero philosophy statement ── */}
        <motion.div {...scrollRevealProps(0)} className="mb-6">
          <h2
            className="
              font-bold tracking-tighter
              text-[clamp(2.5rem,10vw,5rem)] sm:text-[clamp(3rem,10vw,6rem)] md:text-[12vw]
              leading-[0.85]
              text-[#d1d1d6]/60
              select-none
              break-words
            "
          >
            {t("footer.philosophy_line1")}
            <br />
            {t("footer.philosophy_line2")}
            <br />
            {t("footer.philosophy_line3")}
          </h2>
        </motion.div>

        {/* ── Professional tagline ── */}
        <motion.p
          {...scrollRevealProps(0.08)}
          className="text-xs md:text-sm tracking-[0.2em] uppercase text-[#86868b] mt-4"
        >
          {t("footer.tagline")}
        </motion.p>

        {/* ── Functional links ── */}
        <motion.div
          {...scrollRevealProps(0.14)}
          className="flex gap-8 mt-12"
        >
          {linkDefs.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              data-magnetic
              className="
                text-sm text-[#86868b]
                hover:text-foreground
                transition-colors duration-300
                min-h-[44px] min-w-[44px]
                flex items-center
              "
            >
              {t(`footer.${link.key}`)}
            </a>
          ))}
        </motion.div>

        {/* ── Divider + copyright ── */}
        <div className="border-t border-[#e5e7eb] mt-16 pt-6 pb-4">
          <p className="text-[12px] text-[#86868b]/60 tracking-[0.04em]">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
