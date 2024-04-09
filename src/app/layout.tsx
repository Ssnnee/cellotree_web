import "~/styles/globals.css";
import React from "react";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import NavigationMenu from "~/components/NavigationMenu";


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
  // const [isOpen, setIsOpen] = React.useState(false);
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} `}>
        <TRPCReactProvider>
          <main className="flex min-h-screen flex-col items-center justify-center">
          <NavigationMenu />
          {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
