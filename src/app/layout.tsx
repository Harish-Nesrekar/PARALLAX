import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PointerGlow } from "@/components/ui/pointer-glow";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "PARALLAX | Software Engineering & Digital Solutions",
    template: "%s | PARALLAX"
  },
  description:
    "PARALLAX engineers custom software, web and mobile applications, AI automation and SaaS products for businesses.",
  openGraph: {
    title: "PARALLAX — Engineering a Different Perspective",
    description: "Software engineering and digital solutions for ambitious businesses.",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plex.variable} ${display.variable}`}>
        <PointerGlow />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
