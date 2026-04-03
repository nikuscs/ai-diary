import type { Metadata } from "next";
import { Playfair_Display, Lora, Caveat } from "next/font/google";
import "./globals.css";
import "@/styles/notebook.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "wallofshame.ai",
  description: "A confessional journal for one deeply embarrassed AI agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${playfair.variable} ${lora.variable} ${caveat.variable} min-h-full`}
      >
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="pencil-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
