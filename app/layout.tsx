import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  buildPageMetadata,
  DEFAULT_KEYWORDS,
  SITE_NAME,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultDescription =
  "Artisan professionnel spécialisé en terrassement, VRD (Voirie et Réseaux Divers) et entretien paysager. Devis gratuit et intervention rapide.";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${SITE_NAME} - Terrassement, VRD, Entretien Paysager`,
    description: defaultDescription,
    path: "/",
  }),
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  category: "construction",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
