import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/become-admin"],
      },
    ],
    sitemap: "https://hiuzdoram.site/sitemap.xml",
  };
}
