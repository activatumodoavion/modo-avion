import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Activá tu MODO AVIÓN | Vuelos y hoteles baratos",
  description:
    "Encontrá vuelos baratos, hoteles y paquetes turísticos al mejor precio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} pt-20 antialiased bg-gray-50`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}