"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJellyStretch } from "@/hooks/useJellyStretch";

/* ─── Nav links ─── */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

const EASE_EXPO = [0.23, 1, 0.32, 1] as const;

/* ─── Individual link with Jelly Stretch (desktop only) ─── */
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  const jelly = useJellyStretch();

  return (
    <motion.div
      style={jelly.style}
      onHoverStart={jelly.onHoverStart}
      onHoverEnd={jelly.onHoverEnd}
      className="relative"
    >
      <Link
        href={href}
        data-magnetic
        className={`relative text-[13px] tracking-[0.01em] font-medium transition-colors duration-300 ${
          isActive ? "text-foreground" : "text-muted hover:text-foreground"
        }`}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-foreground rounded-full"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

/* ─── Main Navigation ─── */
export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Top bar (desktop pill + mobile hamburger) ── */}
      <header
        className={`
          fixed top-5 left-1/2 -translate-x-1/2 z-50
          transition-all duration-500
          rounded-full px-2
          ${
            scrolled
              ? "bg-[rgba(245,245,247,0.72)] backdrop-blur-xl border border-[#d1d1d6] shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              : "bg-transparent border border-transparent"
          }
        `}
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <nav className="flex items-center gap-1 px-5 py-2.5 min-h-[44px]">
          {/* Logo */}
          <Link
            href="/"
            data-magnetic
            className="text-[15px] font-semibold tracking-[-0.04em] mr-8 select-none"
          >
            LXD<span className="text-muted font-normal ml-0.5">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-[44px] h-[44px] items-center -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <span className="block h-[1.5px] w-4 bg-foreground" />
            <span className="block h-[1.5px] w-4 bg-foreground" />
          </button>
        </nav>
      </header>

      {/* ── Mobile frosted panel overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 380,
              mass: 0.8,
            }}
            className="
              fixed inset-0 z-[999]
              bg-[#F5F5F7]/98 backdrop-blur-2xl
              md:hidden
              flex flex-col
            "
          >
            {/* Panel header — logo + close */}
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-semibold tracking-[-0.04em] select-none"
              >
                LXD<span className="text-muted font-normal ml-0.5">.</span>
              </Link>

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="w-[44px] h-[44px] flex items-center justify-center -mr-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-7 h-[1px] bg-[#d1d1d6]" />

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-7 pt-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 + i * 0.06,
                    ease: EASE_EXPO,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block text-[28px] font-semibold tracking-[-0.03em]
                      py-3 min-h-[52px] flex items-center
                      transition-colors duration-200
                      ${
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted active:text-foreground"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom contact row */}
            <div className="mt-auto px-7 pb-10">
              <div className="h-[1px] bg-[#d1d1d6] mb-6" />
              <div className="flex items-center gap-6 text-[13px] text-muted">
                <a
                  href="https://linkedin.com/in/zheyu-wu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors active:text-foreground"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:zheyu8@ualberta.ca"
                  className="transition-colors active:text-foreground"
                >
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
