import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'src', 'articles');
const distDir = path.join(__dirname, 'dist', 'article');

// Parse frontmatter from markdown
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    
    const frontmatter = match[1];
    const titleMatch = frontmatter.match(/title:\s*(.+)/);
    const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);
    const dateMatch = frontmatter.match(/date:\s*(.+)/);
    const imageMatch = frontmatter.match(/image:\s*(.+)/);
    
    return {
        title: titleMatch ? titleMatch[1].trim() : 'Article',
        excerpt: excerptMatch ? excerptMatch[1].trim() : '',
        date: dateMatch ? dateMatch[1].trim() : '',
        image: imageMatch ? imageMatch[1].trim() : null
    };
}

// Generate HTML with meta tags
function generateHTML(slug, metadata) {
    const articleUrl = `https://alexandrerobin.fr/article/${slug}`;
    // Use article-specific image if available, otherwise use default
    const imageUrl = metadata.image || 'https://alexandrerobin.fr/assets/website_main.png';
    
    // Generate structured data for article
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": metadata.title,
        "description": metadata.excerpt || metadata.title,
        "image": imageUrl,
        "datePublished": metadata.date || new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": "Alexandre Robin",
            "url": "https://alexandrerobin.fr"
        },
        "publisher": {
            "@type": "Person",
            "name": "Alexandre Robin"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        }
    };
    
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/ico" href="/favicon_io/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${metadata.title} - Alexandre Robin</title>
    <meta name="description" content="${metadata.excerpt || metadata.title}" />
    <link rel="canonical" href="${articleUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.excerpt || metadata.title}" />
    <meta property="og:image" content="${imageUrl}" />
    ${metadata.date ? `<meta property="article:published_time" content="${metadata.date}" />` : ''}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${articleUrl}" />
    <meta property="twitter:title" content="${metadata.title}" />
    <meta property="twitter:description" content="${metadata.excerpt || metadata.title}" />
    <meta property="twitter:image" content="${imageUrl}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
}

// Generate sitemap.xml
function generateSitemap(articles) {
    const baseUrl = 'https://alexandrerobin.fr';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;
    
    // Add each article
    articles.forEach(article => {
        const articleDate = article.metadata.date || currentDate;
        sitemap += `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${articleDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });
    
    sitemap += `</urlset>`;
    return sitemap;
}

// Main function
async function generateMetaPages() {
    // Ensure dist/article directory exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Find the actual JS and CSS files from the build
    const assetsDir = path.join(__dirname, 'dist', 'assets');
    const assetFiles = fs.readdirSync(assetsDir);
    const mainJs = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const mainCss = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));
    
    console.log(`Found assets: ${mainJs}, ${mainCss}`);
    
    // Update the generateHTML function to use actual filenames
    const originalGenerateHTML = generateHTML;
    generateHTML = function(slug, metadata) {
        const html = originalGenerateHTML(slug, metadata);
        return html
            .replace('/assets/index.js', `/assets/${mainJs}`)
            .replace('/assets/index.css', `/assets/${mainCss}`);
    };
    
    // Read all markdown files
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    
    console.log(`Generating meta pages for ${files.length} articles...`);
    
    const articlesData = [];
    
    for (const file of files) {
        const slug = file.replace('.md', '');
        const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
        const metadata = parseFrontmatter(content);
        
        // Store article data for sitemap
        articlesData.push({ slug, metadata });
        
        // Create article directory
        const articleDir = path.join(distDir, slug);
        if (!fs.existsSync(articleDir)) {
            fs.mkdirSync(articleDir, { recursive: true });
        }
        
        // Write index.html
        const html = generateHTML(slug, metadata);
        fs.writeFileSync(path.join(articleDir, 'index.html'), html);
        
        console.log(`✓ Generated ${slug}/index.html`);
    }
    
    // Generate sitemap.xml
    const sitemap = generateSitemap(articlesData);
    const sitemapPath = path.join(__dirname, 'dist', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✓ Generated sitemap.xml with ${articlesData.length + 1} URLs`);
    
    console.log('Done!');
}

generateMetaPages().catch(console.error);
