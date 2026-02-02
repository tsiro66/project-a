import type { Metadata } from "next";
import { Bebas_Neue, Inter, Syne } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";
import Navbar from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas_neue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400"
});

const font_syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "Project-A",
  description: "Best website ever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebas_neue.variable} ${font_syne.variable} antialiased`}
      >
        <ClientWrapper>
          <Navbar />
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
