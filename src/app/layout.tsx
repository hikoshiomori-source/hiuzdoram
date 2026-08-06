import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "hiuzdoram — Birinchi va Sifatli | O'zbek tilida doramalar",
    template: "%s | hiuzdoram",
  },
  description:
    "O'zbekistondagi eng birinchi va sifatli dorama platformasi. Eng sara koreyscha, yaponcha va xitoy seriallarini o'zbek tilida, yuqori sifatda (HD) va o'zbek subtitrlarida bepul tomosha qiling.",
  keywords: [
    "dorama uzbek tilida",
    "koreys seriallari",
    "dorama ko'rish",
    "hiuzdoram",
    "hiuzdoram doramalar",
    "o'zbek subtitrlari",
    "xitoy seriallari",
    "yapon anime",
    "dorama online",
    "birinchi raqamli dorama sayti",
    "sifatli tarjima",
    "korean drama uzbek subtitles",
  ],
  metadataBase: new URL("https://hiuzdoram.site"),
  alternates: {
    canonical: "https://hiuzdoram.site",
  },
  openGraph: {
    title: "hiuzdoram — Birinchi va Sifatli | O'zbek tilida doramalar",
    description:
      "O'zbekistondagi eng birinchi va sifatli dorama platformasi. Eng sara seriallarni o'zbek tilida va subtitrlarida tomosha qiling.",
    url: "https://hiuzdoram.site",
    siteName: "hiuzdoram",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hiuzdoram — Birinchi va Sifatli",
    description:
      "Eng sara doramalarni o'zbek tilida bepul tomosha qiling.",
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
  verification: {
    // Add your Google Search Console verification here
    // google: "your-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />

        {/* Global Schema.org WebSite + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "hiuzdoram — Birinchi va Sifatli",
              url: "https://hiuzdoram.site",
              description:
                "O'zbekistondagi birinchi va eng sifatli dorama platformasi — o'zbek subtitrlar va tarjimalar bilan",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://hiuzdoram.site/browse?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-sans">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7761098269498439"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
