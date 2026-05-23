const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next' : '.next-build',
  async headers() {
    const connectSrc = phase === PHASE_DEVELOPMENT_SERVER
      ? "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 ws://localhost:3000 ws://127.0.0.1:3000"
      : "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000"

    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          connectSrc,
          "frame-src 'self' https://player.vimeo.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
        ].join('; '),
      },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
})
