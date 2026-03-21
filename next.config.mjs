/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce trailing slashes for consistent canonical URLs
  trailingSlash: false,

  // Compress responses
  compress: true,

  // Powered-by header off (security + cleaner headers)
  poweredByHeader: false,

  // Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Performance
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/icon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/apple-icon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.localclawagents.com" }],
        destination: "https://localclawagents.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
