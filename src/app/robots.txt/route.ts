import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.rahulpnath.com/sitemap.xml

# Crawl-delay (optional - helps with server load)
Crawl-delay: 1

# Block access to admin/private areas if any
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow access to images and assets
Allow: /images/
Allow: /public/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.woff$
Allow: /*.woff2$
Allow: /*.ttf$
Allow: /*.eot$

# Host directive (helps search engines understand the preferred domain)
Host: https://www.rahulpnath.com`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400', // Cache for 24 hours
    },
  });
}