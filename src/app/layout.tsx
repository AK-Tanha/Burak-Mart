import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import "./globals.css";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-headline',
});

const dmSans = DM_Sans({
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
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="antialiased font-body text-charcoal">
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
