import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron"
});

export const metadata: Metadata = {
  title: "TopCars Valley - Conectando Máquinas e Pessoas",
  description: "Onde a paixão automotiva encontra a inovação digital. Uma plataforma exclusiva para entusiastas que transformam ferro em sonhos e conectam histórias através de rodas.",
  keywords: ["carros esportivos", "comunidade automotiva", "eventos", "networking", "carros de luxo"],
  authors: [{ name: "TopCars Valley" }],
  creator: "TopCars Valley",
  publisher: "TopCars Valley",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    url: "https://topcarsvalley.com",
    title: "TopCars Valley - Conectando Máquinas e Pessoas",
    description: "Onde a paixão automotiva encontra a inovação digital.",
    siteName: "TopCars Valley",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopCars Valley - Conectando Máquinas e Pessoas",
    description: "Onde a paixão automotiva encontra a inovação digital.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${orbitron.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
