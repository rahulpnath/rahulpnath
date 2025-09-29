import { getAllPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = 'https://www.rahulpnath.com';
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Rahul Nath - Developer Blog</title>
    <description>Thoughts, tutorials, and insights on web development, AWS, .NET, and modern technologies by Rahul Nath.</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <managingEditor>rahul@rahulpnath.com (Rahul Nath)</managingEditor>
    <webMaster>rahul@rahulpnath.com (Rahul Nath)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <image>
      <url>${baseUrl}/rahul-logo.png</url>
      <title>Rahul Nath - Developer Blog</title>
      <link>${baseUrl}</link>
    </image>
    ${posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <author>rahul@rahulpnath.com (Rahul Nath)</author>
      ${post.tags ? post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
      ${post.coverImage ? `<enclosure url="${post.coverImage.startsWith('http') ? post.coverImage : baseUrl + post.coverImage}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400', // Cache for 24 hours
    },
  });
}