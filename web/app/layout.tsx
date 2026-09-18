import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRADR — учебная торговая симуляция",
  description: "Рынок, терминал и портфель торговых агентов TRADR.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;485;500;535;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
