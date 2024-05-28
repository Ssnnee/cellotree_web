import "~/styles/globals.css";
import React from "react";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/components/ui/toaster"
import { AuthProvider } from "./_components/auth-provider";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "CelloTree",
  description: "An application to build your family tree ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="fr">
        <body className={`min-h-screen bg-background font-sans ${inter.variable} `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <TRPCReactProvider>
            <main className="relative flex min-h-screen flex-col bg-background">
              {children}
            </main>
          </TRPCReactProvider>
          <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
