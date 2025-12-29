---
title: How I Built My Personal Website with React, Vite, and TypeScript
date: 2025-12-26
excerpt: I walk through the architecture, frameworks, languages, and GitHub Workflows I used to create my personal portfolio website.
---

# How I Built My Personal Website with React, Vite, and TypeScript
  ![How I Built My Personal Website with React, Vite, and TypeScript](/assets/website_main.png)

By Alexandre Robin

### Why create a personal website?

As a developer and HR professional, I've always wanted a space to showcase my projects, share my thoughts, and connect with others in the tech community. After building bots and scrapers, I decided it was time to create my own digital home. This personal page serves as my portfolio, blog, and a way to document my journey in coding.

My goals were simple:

*   Display my articles and projects
*   Have a clean, responsive design
*   Make it easy to maintain and update
*   Deploy it automatically with modern tools

### Reviewing the basics

For this project, I'll use:

*   React for the user interface
*   Vite as the build tool
*   TypeScript for type safety
*   GitHub Actions for continuous deployment

React is a JavaScript library for building user interfaces. It's component-based, making it easy to create reusable UI elements.

Vite provides a fast build tool that leverages ES modules for instant server start and lightning-fast hot module replacement.

TypeScript adds static typing to JavaScript, helping catch errors early and improve code quality.

GitHub Workflows allow automating the build and deployment process directly from the repository.

I chose this stack because it's modern, fast, and well-suited for a personal project. Plus, it's what many developers are using today.


First, I set up the project with Vite. It's incredibly easy:

```bash
npm create vite@latest alexandrerobin.fr -- --template react-ts
cd alexandrerobin.fr
npm install
```

This gives me a basic React app with TypeScript support. Then, I added some essential packages:

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

For the structure, I organized it like this:

```
src/
  components/     # Reusable UI components
  articles/       # Markdown files for blog posts
  assets/         # Images and other static files
  App.tsx         # Main app component
  main.tsx        # Entry point
```

### Architecture

The app is built around a few key components:

*   **Hero**: The landing section with my introduction
*   **Articles**: A list of my blog posts
*   **Experiences**: My professional background
*   **Footer**: Info on the Tech Stack & Links

Each component is a separate file in the `components/` folder. For example, the Articles component reads the Markdown files and renders them:

```tsx
import React from 'react';
import Article from './Article';

const articles = [
  { title: 'How I Scraped 7000 Articles...', excerpt: '...', date: '2017-12-20' },
  { title: 'How I Built an HR Slack Bot...', excerpt: '...', date: '2018-09-18' },
  // More articles
];
const Articles: React.FC = () => {
  return (
    <section>
      {articles.map((article, index) => (
        <Article key={index} {...article} />
      ))}
    </section>
  );
};

export default Articles;
```

The routing is handled by React Router, but since it's a simple site, I kept it to a single page with sections.

For styling, I used plain CSS with some responsive design principles. The `App.css` contains global styles, and each component has its own styles.

### Frameworks and Languages

**React**: The core framework. I used functional components with hooks for state management. No complex state here, just simple props passing.

**Vite**: The build tool. It handles development server, bundling, and optimization. The config is minimal:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**TypeScript**: All components are `.tsx` files. It helps with autocomplete and catching type errors. The config is standard:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**HTML and CSS**: Basic structure and styling. I kept it simple with Flexbox for layouts.

### GitHub Workflows

To automate deployment, I set up GitHub Actions. Every push to the main branch triggers a build and deploy to GitHub Pages.

The workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

This ensures the site is always up-to-date. I also added ESLint checks to maintain code quality.

### DNS and Cloudflare

This site is built and deployed on GitHub Pages, while the domain alexandrerobin.fr is managed through Cloudflare (DNS + proxy). The Cloudflare layer provides the custom domain and HTTPS, but it also aggressively caches content.

Because Cloudflare caching can hide fresh changes, when I want to test a build in a production-like environment without disabling cache, I publish the local `dist` output to Surge and preview there:

```bash
npm run build
npx surge ./dist alexandrerobin-preview.surge.sh
```

This gives me a temporary, CDN-served URL to validate assets, routing, and headers as they would behave in production—without touching Cloudflare settings or purging its cache.


### Conclusion

Building this personal website was a great way to apply what I've learned in React and modern web development. It's fast, maintainable, and automatically deployed. The stack of React, Vite, and TypeScript makes development enjoyable.

The source code is available on GitHub: [https://github.com/alexandrerobin/alexandrerobin.fr](https://github.com/alexandrerobin/alexandrerobin.fr). Feel free to check it out and get inspired!

* * *

Initially published on [alexandrerobin.fr](https://alexandrerobin.fr)

