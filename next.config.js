/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // A wildcard host turned the optimizer into an open proxy: anyone could
    // make this server fetch and re-serve arbitrary remote images, which is
    // also the reachable surface for the image-decoding advisories.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    unoptimized: false,
  },
  reactStrictMode: true,
  // Don't advertise the framework.
  poweredByHeader: false,

  // Baseline hardening. The CMS in particular was framable, so an attacker page
  // could overlay it and trick a signed-in admin into clicking through it.
  async headers() {
    const baseline = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ];

    return [
      { source: '/:path*', headers: baseline },
      {
        // Tighter still for the admin surface: no framing, no third-party code.
        source: '/admin/:path*',
        headers: [
          ...baseline,
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              // Next's dev overlay and hydration need inline/eval in development.
              process.env.NODE_ENV === 'production'
                ? "script-src 'self' 'unsafe-inline'"
                : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
