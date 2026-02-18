import type { Metadata } from "next";
import { Bebas_Neue, Inter, Syne } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper";

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
  title: "Flux | Κατασκευή Ιστοσελίδων & High-End Digital Solutions",
  description:
    "Δημιουργία σύγχρονων ιστοσελίδων, e-shop και εφαρμογών με Next.js και GSAP animations. Υψηλή αισθητική και ταχύτητα.",
  keywords: [
    "Next.js developer Greece",
    "κατασκευή ιστοσελίδων",
    "freelance web developer greece",
    "GSAP animations",
    "δημιουργία eshop",
    "Flux development",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();
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

        <SmoothScrollWrapper>
          <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
