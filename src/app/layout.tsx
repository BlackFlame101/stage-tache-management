import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast'; 
import "@/styles/globals.css"; 

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Gestionnaire de Tâches Central",
  description: "Application de gestion de tâches avec CSS Modules",
  authors:[{ name: "Benouari Badr-Eddine" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head />
      <body className={inter.className}>
        <Toaster
          position="top-right" 
          toastOptions={{
            duration: 3000, 
            style: { 
              background: '#333',
              color: '#fff',
              fontSize: '15px',
              borderRadius: '8px',
              padding: '12px 18px',
            },
            success: { 
              duration: 2500,
              iconTheme: {
                primary: '#22c55e', 
                secondary: 'white',
              },
            },
            error: { 
              duration: 4000,
              iconTheme: {
                primary: '#ef4444', 
                secondary: 'white',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
