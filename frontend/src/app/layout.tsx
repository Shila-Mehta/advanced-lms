import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../redux/provider";

export const metadata: Metadata = {
  title: "My App",
  description: "App with Next.js + Redux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
