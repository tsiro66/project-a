import type { Metadata } from "next";
import { Bebas_Neue, Inter, Syne } from "next/font/google";
import "./globals.css";
// import ClientWrapper from "./components/ClientWrapper";
import Navbar from "./components/Navbar";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas_neue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const font_syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Project-A",
  description: "Best website ever",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${bebas_neue.variable} ${font_syne.variable} antialiased`}
      >
        <SmoothScroll>
          <NextIntlClientProvider>
            <Navbar />
            {children}
          </NextIntlClientProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
