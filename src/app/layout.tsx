import type { Metadata } from "next";
import { Outfit, Inter } from 'next/font/google';
import "./globals.css";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "Burak Mart",
  description: "Bespoke high-performance shopping experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased font-body text-[var(--color-text-main)] bg-[var(--color-surface-base)]">
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
