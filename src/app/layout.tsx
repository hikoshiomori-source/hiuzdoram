import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nocturne Dorama — Premium Asian Drama Streaming",
  description:
    "Discover and watch the best Korean, Japanese, and Chinese dramas with Uzbek subtitles. Premium streaming experience with Nocturne Dorama.",
  keywords: ["dorama", "kdrama", "streaming", "korean drama", "uzbek subtitles"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-sans">
        {children}
      </body>
    </html>
  );
}
