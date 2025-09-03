import { test, expect } from '@playwright/test';

/**
 * Generic blog post test that can be used for any blog post
 * To use this test for different blog posts, update the testData array below
 */
const testData = [
  {
    slug: 'getting-started-with-amazon-cognito-setting-up-user-pools-and-app-clients',
    title: 'Getting Started with Amazon Cognito: Setting Up User Pools and App Clients'
  }
  // Add more blog posts here as needed:
  // {
  //   slug: 'your-blog-post-slug',
  //   title: 'Your Blog Post Title'
  // }
];

testData.forEach(({ slug, title }) => {
  test(`should load blog post "${title}" and render heading correctly`, async ({ page }) => {
    const postUrl = `http://localhost:3000/posts/${slug}`;
    
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
});
