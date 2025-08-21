import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src", "posts");

fs.readdirSync(postsDirectory).forEach(file => {
  if (file.endsWith(".md") || file.endsWith(".mdx")) {
    const fullPath = path.join(postsDirectory, file);
    console.log(`🔍 Checking: ${file}`);
    const content = fs.readFileSync(fullPath, "utf8");
    try {
      matter(content);
      console.log(`✅ ${file} is fine`);
    } catch (err) {
      console.error(`❌ YAML error in ${file}`);
      console.error(err.message);
    }
  }
});
