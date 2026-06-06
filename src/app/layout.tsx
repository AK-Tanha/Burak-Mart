import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import "./globals.css";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "Burak Mart - Shop Trending Fashion & Accessories",
  description: "Burak Mart - Trendy Fashion, Accessories & More. Fast Delivery | Cash on Delivery | 100% Authentic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased font-body text-neutral-900 bg-white">
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
