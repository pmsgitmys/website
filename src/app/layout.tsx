import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
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
  title: "PhoneMax - Electronics Store in Mysore | Smartphones, Laptops, Accessories",
  description: "Best electronics store in Mysore, Karnataka. Buy latest smartphones, laptops, headphones, and accessories with genuine warranty. Free delivery in Mysore. Visit our store today!",
  keywords: "electronics store mysore, mobile phones mysore, laptops mysore, smartphone store, electronics shop karnataka, phonemax",
  authors: [{ name: "PhoneMax Electronics" }],
  creator: "PhoneMax Electronics",
  publisher: "PhoneMax Electronics",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://phonemax.in",
    siteName: "PhoneMax Electronics",
    title: "PhoneMax - #1 Electronics Store in Mysore",
    description: "Buy latest smartphones, laptops & accessories with genuine warranty in Mysore. Same day delivery available.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PhoneMax Electronics Store Mysore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneMax Electronics - Mysore",
    description: "Latest electronics with genuine warranty in Mysore",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
