# Social Media Sharing Setup

## What Was Fixed

Your website articles now have proper meta tags for social media sharing on LinkedIn, Facebook, Twitter, and other platforms.

## What Was Added

### 1. Base Meta Tags (index.html)
- Added default Open Graph and Twitter Card meta tags to the main `index.html`
- These tags show when sharing the homepage

### 2. Dynamic Meta Tags (Article.tsx)
- Installed `react-helmet-async` to manage dynamic meta tags
- Articles now update page title and meta tags based on frontmatter
- This helps with SEO and browser display

### 3. Pre-rendered HTML Pages (generate-meta.js)
- **This is the key solution**: A Node.js script generates static HTML files for each article
- Social media crawlers (which don't execute JavaScript) can now read the meta tags
- The script runs automatically after each build

## How It Works

1. When you build (`npm run build`), Vite compiles your React app
2. The `generate-meta.js` script then creates static HTML files:
   - `/dist/article/howibuiltthiswebsite/index.html`
   - `/dist/article/HRbot/index.html`
   - `/dist/article/howiscrapped7000articles/index.html`
3. Each HTML file has:
   - Article title
   - Article description (from `excerpt` in frontmatter)
   - Article URL
   - Preview image
   - Publication date
   - All necessary Open Graph and Twitter Card tags

4. When someone shares your article:
   - LinkedIn/Facebook/Twitter crawlers request the URL
   - They receive the static HTML with all meta tags (no JavaScript needed)
   - The preview is generated from the meta tags
   - Once the page loads in a browser, React takes over and renders the full content

## Article Frontmatter

Your markdown articles should have frontmatter like this:

\`\`\`yaml
---
title: Your Article Title
date: 2025-12-26
excerpt: A brief description that will appear in social media previews
image: https://alexandrerobin.fr/assets/custom-preview.png  # Optional
---
\`\`\`

- `title`: Required - appears in the preview
- `excerpt`: Recommended - description for social media
- `date`: Optional - publication date
- `image`: Optional - custom preview image (if not provided, uses website_main.png)

## Preview Image

Currently using: `/assets/website_main.png` as the default

**Recommended image specs for social media:**
- Size: 1200 x 630 pixels
- Format: PNG or JPG
- Max file size: ~5MB

To use a custom image for a specific article, add this to its frontmatter:
\`\`\`yaml
image: https://alexandrerobin.fr/assets/your-article-image.png
\`\`\`

## Testing Your Social Media Preview

Before deploying, test your links:

1. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

Simply paste your article URL and see how it will appear!

## Deployment

When you push to GitHub, your GitHub Actions workflow will:
1. Run `npm run build` (which includes the meta generation script)
2. Deploy the `dist` folder with all the pre-rendered HTML files
3. Social media crawlers will be able to read the meta tags

## Files Modified

- `/index.html` - Added base meta tags
- `/src/main.tsx` - Added HelmetProvider wrapper
- `/src/components/Article.tsx` - Added dynamic Helmet meta tags + metadata parsing
- `/package.json` - Updated build script
- `/generate-meta.js` - NEW: Pre-rendering script

## Notes

- The static HTML files are generated at build time, not dynamically
- If you add/modify articles, run `npm run build` to regenerate the meta pages
- The React app still works normally for users - this only affects crawlers
