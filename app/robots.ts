import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/thank-you"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api/", "/thank-you"],
      },
    ],
    sitemap: "https://localclawagents.com/sitemap.xml",
  };
}
