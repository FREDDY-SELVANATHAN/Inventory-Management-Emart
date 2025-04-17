import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMART Inventory Management",
  description: "Inventory management system for EMART grocery shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
