import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, Karla } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

// --------- FONTS ---------
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const fontDisplay = Figtree({
  variable: "--font-display",
});

const fontBody = Karla({
  variable: "--font-body",
});

// --------- METADATA ---------
export const metadata: Metadata = {
  metadataBase: new URL("https://som3aware.vercel.app/"),
  title: { default: "Som3aware", template: "%s | Som3aware" },
  description: "Crafting elegant products that captivate and delight users ✨",
  openGraph: {
    title: "Som3aware",
    description:
      "Crafting elegant products that captivate and delight users ✨",
    url: "https://som3aware.vercel.app/",
    siteName: "Som3aware",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Som3aware",
    card: "summary_large_image",
  },
};

// --------- LAYOUT ---------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${fontDisplay.variable} ${fontBody.variable} font-body bg-zinc-50 selection:bg-zinc-200 dark:bg-zinc-900 dark:selection:bg-zinc-700 scroll-smooth antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            <MaxWidthWrapper>{children}</MaxWidthWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
