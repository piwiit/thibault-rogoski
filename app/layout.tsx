import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thibault Rogoski - Terrassement, VRD, Entretien Paysager",
  description: "Artisan du BTP spécialisé en terrassement, VRD (Voirie et Réseaux Divers) et entretien paysager. Expert en aménagement extérieur.",
  keywords: ["terrassement", "VRD", "entretien paysager", "BTP", "aménagement extérieur", "artisan"],
  authors: [{ name: "Thibault Rogoski" }],
  openGraph: {
    title: "Thibault Rogoski - Terrassement, VRD, Entretien Paysager",
    description: "Artisan du BTP spécialisé en terrassement, VRD et entretien paysager. Expert en aménagement extérieur.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thibault Rogoski - Terrassement, VRD, Entretien Paysager",
    description: "Artisan du BTP spécialisé en terrassement, VRD et entretien paysager.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
