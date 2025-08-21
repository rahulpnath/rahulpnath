import fs from "fs-extra";
import path from "path";
import fetch from "node-fetch";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

// Paths
const postsDir = path.join(process.cwd(), "src/posts");
const imagesDir = path.join(process.cwd(), "public/images");
const ghostExportPath = path.join(process.cwd(), "ghost-export.json");

// Ghost site URL (used for relative paths)
const GHOST_URL = "https://www.rahulpnath.com";

// Ensure directories exist
fs.ensureDirSync(postsDir);
fs.ensureDirSync(imagesDir);

// Initialize Turndown for HTML → Markdown
const turndownService = new TurndownService();

// --- Download image ---
async function downloadImage(url: string): Promise<string | null> {
  if (!url) return null;

  if (url.includes("__GHOST_URL__")) url = url.replace("__GHOST_URL__", "");
  if (url.startsWith("/")) url = `${GHOST_URL}${url}`;

  const fileName = path.basename(url);
  const destPath = path.join(imagesDir, fileName);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch '${url}' (${res.status})`);

    const buffer = await res.buffer();
    fs.writeFileSync(destPath, buffer);
    console.log(`✅ Downloaded ${url} → /images/${fileName}`);
    return `/images/${fileName}`;
  } catch (err) {
    console.error(`❌ Error downloading ${url}:`, err);
    return null;
  }
}

// --- Convert Ghost HTML → MDX ---
async function convertGhostToMDX() {
  if (!fs.existsSync(ghostExportPath)) {
    console.error("❌ ghost-export.json not found!");
    return;
  }

  const exportJson = fs.readJSONSync(ghostExportPath);
  const posts = exportJson?.db?.[0]?.data?.posts || [];

  for (const post of posts) {
    const dom = new JSDOM(post.html);
    const document = dom.window.document;

    // 1️⃣ Download & replace <img> src
    const imgTags = document.querySelectorAll("img");
    for (const img of Array.from(imgTags)) {
      const srcAttr = img.getAttribute("src");
      if (!srcAttr) continue;

      const localPath = await downloadImage(srcAttr);
      if (localPath) img.setAttribute("src", localPath);
    }

    // 2️⃣ Convert <iframe> to MDX embed
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of Array.from(iframes)) {
      const srcAttr = iframe.getAttribute("src");
      if (!srcAttr) continue;

      const mdxEmbed = `<iframe src="${srcAttr}" />`;
      iframe.replaceWith(document.createTextNode(mdxEmbed));
    }

    // 3️⃣ Prepare frontmatter
    const slug = post.slug || post.title.replace(/\s+/g, "-").toLowerCase();
    const date = post.published_at || new Date().toISOString().split("T")[0];

    // Feature image
    let featureImagePath: string | null = null;
    if (post.feature_image) featureImagePath = await downloadImage(post.feature_image);

    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
feature_image: "${featureImagePath || ''}"
tags: ${post.tags ? JSON.stringify(post.tags.map((t: any) => t.name)) : '[]'}
---
`;

    // 4️⃣ Convert HTML → Markdown
    const markdown = turndownService.turndown(document.body.innerHTML);
    const mdxContent = `${frontmatter}\n${markdown}`;

    // 5️⃣ Save MDX file
    const filePath = path.join(postsDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, "utf8");

    console.log(`✅ Converted: ${post.title}`);
  }
}

convertGhostToMDX().catch((err) => console.error(err));
