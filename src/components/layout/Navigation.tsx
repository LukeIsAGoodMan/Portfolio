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

/* ─── Individual link with Jelly Stretch ─── */
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

  return (
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
      <nav className="flex items-center gap-1 px-5 py-2.5">
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
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <motion.span
            className="block h-[1.5px] w-4 bg-foreground origin-center"
            animate={
              menuOpen
                ? { rotate: 45, y: 3.25 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
          <motion.span
            className="block h-[1.5px] w-4 bg-foreground origin-center"
            animate={
              menuOpen
                ? { rotate: -45, y: -3.25 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden border-t border-[#d1d1d6]"
          >
            <div className="flex flex-col gap-3 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[14px] font-medium transition-colors ${
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
