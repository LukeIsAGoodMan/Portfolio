import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import MagneticCursor from "@/components/layout/MagneticCursor";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LXD Portfolio — Learning Experience Designer",
  description:
    "Designing digital learning experiences where pedagogy meets precision.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <MagneticCursor />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Minimal footer */}
        <footer className="border-t border-border py-10 px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
          <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-muted">
            <p>&copy; {new Date().getFullYear()} LXD Portfolio</p>
            <div className="flex items-center gap-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                data-magnetic
              >
                LinkedIn
              </a>
              <a
                href="mailto:hello@example.com"
                className="transition-colors hover:text-foreground"
                data-magnetic
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
