import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, Karla } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { HeyAllBanner } from "@/components/banners/hey-banner";

// --------- FONTS ---------
const fontLogo = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-logo",
  weight: "100 900",
});

const fontMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

const fontDisplay = Figtree({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontSans = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
});

// --------- METADATA ---------
export const metadata: Metadata = {
  metadataBase: new URL("https://radmanesh.vercel.app/"),
  title: { default: "Radmanesh", template: "%s | Radmanesh" },
  description: "Personal homepage of Arman Radmanesh ✨",
  keywords: [
    "Radmanesh",
    "Software Engineering",
    "Researcher",
    "Cut.social",
    "Healthcare",
    "AI",
    "Machine Learning",
    "Data Science",
    "Web Development",
    "React",
    "Next.js",
    "Node.js",
    "Blog",
    "About",
    "Contact",
  ],
  openGraph: {
    title: "Radmanesh",
    description:
      "Personal homepage of Arman Radmanesh ✨",
    url: "https://radmanesh.vercel.app/",
    siteName: "Radmaanesh",
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
    title: "ArmanRadmanesh",
    site: "ArmanRadmanesh",
    creator: "@ArmanRadmanesh",
    description:
      "My twitter account website",
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
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} ${fontLogo.variable}
          font-sans bg-zinc-50 selection:bg-zinc-200 dark:bg-zinc-900 dark:selection:bg-zinc-700 scroll-smooth antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip mb-6">
            <HeyAllBanner />
            <Header />
            <MaxWidthWrapper>{children}</MaxWidthWrapper>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
