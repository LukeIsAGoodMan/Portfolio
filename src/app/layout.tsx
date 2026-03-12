import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import MagneticCursor from "@/components/layout/MagneticCursor";
import PageTransition from "@/components/layout/PageTransition";
import Footer from "@/components/layout/Footer";
import I18nProvider from "@/components/I18nProvider";
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
        <I18nProvider>
          <Navigation />
          <MagneticCursor />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
