import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import BackToTop from "@/src/components/BackToTop";

export const metadata: Metadata = {
  title: "MGCK Science - Senior Science Society",
  description: "Senior Science Society of Mahamaya Girls' College",
  icons: {
    icon: '/Logos/2.png',
    apple: '/Logos/2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <BackToTop />
      </body>
    </html>
  );
}
