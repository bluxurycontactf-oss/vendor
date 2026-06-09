import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0A66FF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Vendor — Créez votre boutique en ligne en Afrique",
  description: "La plateforme e-commerce #1 pour les commerçants africains. Vendez en ligne, acceptez les paiements Mobile Money et développez votre business.",
  keywords: ["boutique en ligne", "e-commerce Afrique", "Mobile Money", "vendre en ligne", "Bénin"],
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '16px',
                  background: '#0D1B3E',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
