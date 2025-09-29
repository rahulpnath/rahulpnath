import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers and create response
  const response = NextResponse.next();

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.google.com *.googletagmanager.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "img-src 'self' blob: data: *.youtube.com *.ytimg.com *.googleapis.com *.googleusercontent.com *.gravatar.com",
    "font-src 'self' fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'self' *.youtube.com *.youtube-nocookie.com",
    "connect-src 'self' *.youtube.com *.googleapis.com *.google.com *.googletagmanager.com",
    "media-src 'self' *.youtube.com *.ytimg.com",
    "worker-src 'self' blob:",
    "child-src 'self' *.youtube.com",
    "manifest-src 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  // Security Headers
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filtering
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy (formerly Feature Policy)
  response.headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'bluetooth=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
    'speaker-selection=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)'
  ].join(', '));
  
  // Strict Transport Security (HSTS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Cross-Origin Embedder Policy
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  
  // Cross-Origin Opener Policy
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Cross-Origin Resource Policy
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Remove Server header for security
  response.headers.set('Server', '');
  
  // Remove X-Powered-By header
  response.headers.delete('X-Powered-By');

  // HTTPS Redirect
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
    return NextResponse.redirect(
      `https://${request.nextUrl.hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|feed.xml).*)',
  ],
}