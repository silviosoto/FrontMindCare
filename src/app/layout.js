import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ProtectedRoutesProvider } from './Providers/protectedRoutes.provider';
import { ContextProvider } from "./context/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MindCare",
  description: "Created by MindCare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ContextProvider>
          <ProtectedRoutesProvider>{children}</ProtectedRoutesProvider>

        </ContextProvider>
      </body>
    </html>
  );
}
