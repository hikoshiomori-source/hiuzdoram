import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "hiuzdoram — Premium Asian Drama Streaming | O'zbek tilida doramalar",
    template: "%s | hiuzdoram",
  },
  description:
    "Eng sara koreyscha, yaponcha va xitoycha doramalarni o'zbek subtitrlar bilan tomosha qiling. Premium sifatli streaming — hiuzdoram.site platformasida.",
  keywords: [
    "dorama",
    "kdrama",
    "koreyscha serial",
    "yapon anime",
    "xitoy serial",
    "o'zbek subtitrlari",
    "dorama ko'rish",
    "hiuzdoram",
    "koreys dorama uzbek",
    "dorama online",
    "streaming",
    "korean drama uzbek subtitles",
  ],
  metadataBase: new URL("https://hiuzdoram.site"),
  alternates: {
    canonical: "https://hiuzdoram.site",
  },
  openGraph: {
    title: "hiuzdoram — Premium Asian Drama Streaming",
    description:
      "Eng sara doramalarni o'zbek subtitrlar bilan tomosha qiling. Premium sifat, tez yuklash.",
    url: "https://hiuzdoram.site",
    siteName: "hiuzdoram",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hiuzdoram — Premium Asian Drama Streaming",
    description:
      "Eng sara doramalarni o'zbek subtitrlar bilan tomosha qiling.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7761098269498439"
          crossOrigin="anonymous"
        ></script>

        {/* Global Schema.org WebSite + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "hiuzdoram",
              url: "https://hiuzdoram.site",
              description:
                "Premium Asian doramalar platformasi — o'zbek subtitrlar bilan",
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
        {children}
      </body>
    </html>
  );
}
