import type { Metadata } from "next";
import {
  Bebas_Neue,
  Inter,
  Syne,
} from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas_neue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const font_syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
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

const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${bebas_neue.variable} ${font_syne.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />

        <div id="initial-loader">
          <div className="loader-content">
            <h1 className="loader-logo">Flux</h1>
          </div>
        </div>

        <SmoothScroll>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
