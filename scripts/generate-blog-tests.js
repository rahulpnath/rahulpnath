const fs = require('fs');
const path = require('path');

const postsDir = '/Users/rahulpnath/Documents/my-blog/src/posts';
const testFilePath = '/Users/rahulpnath/Documents/my-blog/tests/blog-posts.spec.ts';

// Function to extract frontmatter from MDX file
function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      return null;
    }
    
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*["'](.*)["']/);
    const slugMatch = frontmatter.match(/slug:\s*["'](.*)["']/);
    
    if (titleMatch && slugMatch) {
      return {
        title: titleMatch[1],
        slug: slugMatch[1]
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Get all MDX files
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));
const testData = [];

console.log(`Found ${files.length} MDX files`);

// Extract data from each file
files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const data = extractFrontmatter(filePath);
  
  if (data) {
    testData.push(data);
    console.log(`✓ ${file}: ${data.title}`);
  } else {
    console.log(`✗ ${file}: Could not extract frontmatter`);
  }
});

console.log(`\nExtracted data for ${testData.length} posts`);

// Generate the test file content
const testFileContent = `import { test, expect } from '@playwright/test';

/**
 * Generic blog post test that can be used for any blog post
 * This file is auto-generated from all posts in the /src/posts directory
 */
const testData = [
${testData.map(data => `  {
    slug: '${data.slug}',
    title: '${data.title.replace(/'/g, "\\'")}'
  }`).join(',\n')}
];

testData.forEach(({ slug, title }) => {
  test(\`should load blog post "\${slug}" and render heading correctly\`, async ({ page }) => {
    const postUrl = \`http://localhost:3000/posts/\${slug}\`;
    
    // Navigate to the blog post
    await page.goto(postUrl);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page title contains the site name
    await expect(page).toHaveTitle(/My Blog/);

    // Verify the main heading is rendered correctly
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();

    // Verify the page URL is correct
    expect(page.url()).toBe(postUrl);

    // Verify that the article container is present
    await expect(page.getByRole('article')).toBeVisible();
  });
});`;

// Write the updated test file
fs.writeFileSync(testFilePath, testFileContent);
console.log(`\n✓ Updated test file: ${testFilePath}`);
console.log(`✓ Generated ${testData.length} test cases`);
