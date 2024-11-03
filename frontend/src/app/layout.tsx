import "@styles/globals.css";

import type { Metadata } from "next";
import { Toaster } from "sonner";

import { NextUI } from "./provider";

export const metadata: Metadata = {
  title: "GoTeam",
  description: "Application to manage users in Go backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster position="bottom-right" expand={true} closeButton richColors />
        <NextUI>{children}</NextUI>
      </body>
    </html>
  );
}
