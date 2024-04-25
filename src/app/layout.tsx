import "~/styles/globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import NavigationMenu from "~/app/_components/NavigationMenu";
import { ThemeProvider } from "next-themes";


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
    <ClerkProvider>
      <html lang="fr">
        <body className={`font-sans ${inter.variable} `}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
          <TRPCReactProvider>
            <main className="flex min-h-screen flex-col items-center justify-center ">
            <NavigationMenu />
            {children}
            </main>
          </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
