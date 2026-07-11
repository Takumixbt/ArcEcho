import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "ArcEcho — Content Royalty Infrastructure on Arc",
  description:
    "Buy or rent digital content on Arc. Creators paid instantly in USDC. Flat 5% protocol fee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
