import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const postsDir = path.join(process.cwd(), "src/posts");
const imagesDir = path.join(process.cwd(), "public/images");
const GHOST_URL = "https://your-ghost-site.com"; // replace with actual Ghost URL

fs.mkdirSync(imagesDir, { recursive: true });

// Download image and return local path
async function downloadImage(url: string): Promise<string | null> {
  if (!url) return null;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `${GHOST_URL}${url}`;
  }

  const fileName = path.basename(url);
  const destPath = path.join(imagesDir, fileName);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return `/images/${fileName}`;
  } catch (err) {
    console.error(`❌ Error downloading ${url}:`, err);
    return null;
  }
}

// Process each MDX file
async function processFiles() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // ---- Handle Markdown images ![alt](url) ----
    const mdImageRegex = /!\[.*?\]\((.*?)\)/g;
    let match: RegExpExecArray | null;
    while ((match = mdImageRegex.exec(content)) !== null) {
      const localPath = await downloadImage(match[1]);
      if (localPath) content = content.replace(match[1], localPath);
    }

    // ---- Handle <img> tags in HTML ----
    const dom = new JSDOM(content);
    const imgTags = dom.window.document.querySelectorAll("img");
    for (const img of Array.from(imgTags) as HTMLImageElement[]) {
      const srcAttr = img.getAttribute("src");
      if (!srcAttr) continue;
      const localPath = await downloadImage(srcAttr);
      if (localPath) img.setAttribute("src", localPath);
    }

    // Write updated content
    content = dom.serialize();
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Processed images for: ${file}`);
  }
}

processFiles().catch(console.error);
