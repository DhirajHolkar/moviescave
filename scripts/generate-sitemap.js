// scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Create Sanity client
const client = createClient({
  projectId: 'owumx8en',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-12-01',
});

// Your domain name
const baseUrl = 'https://bingecave.com';

async function fetchSlugs() {
  const blogListSlugs = await client.fetch(`*[_type == "blogsListDetails" && defined(slug.current)]{ "slug": slug.current }`);
  const blogStandardSlugs = await client.fetch(`*[_type == "blogsStandardDetails" && defined(slug.current)]{ "slug": slug.current }`);
  const animeSlugs = await client.fetch(`*[_type == "animesDetails" && defined(slug.current)]{ "slug": slug.current }`);

  return {
    blogList: blogListSlugs.map(item => `${baseUrl}/blog-list/${item.slug}`),
    blogStandard: blogStandardSlugs.map(item => `${baseUrl}/blog-standard-post/${item.slug}`),
    anime: animeSlugs.map(item => `${baseUrl}/anime-details/${item.slug}`),
  };
}

async function generateSitemap() {
  const slugs = await fetchSlugs();

  const staticPages = [
    `${baseUrl}/`,
    `${baseUrl}/about`,
  ];

  const allUrls = [
    ...staticPages,
    ...slugs.blogList,
    ...slugs.blogStandard,
    ...slugs.anime,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(url => {
    return `<url><loc>${url}</loc></url>`;
  })
  .join('\n')}
</urlset>`;

  const filePath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(filePath, sitemap);
  console.log('✅ Sitemap generated at public/sitemap.xml');
}

generateSitemap().catch(err => {
  console.error('❌ Failed to generate sitemap:', err);
});
