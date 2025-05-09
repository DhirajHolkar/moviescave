const fs = require('fs')
const path = require('path')
const client = require('../sanity.js') // Make sure your sanity.js uses module.exports

const siteUrl = 'https://bingecave.com'

async function getSlugs() {
  const blogList = await client.fetch(`*[_type == "blogsListDetails"]{ "slug": slug.current }`)
  const standardPosts = await client.fetch(`*[_type == "blogsStandardDetails"]{ "slug": slug.current }`)
  const animes = await client.fetch(`*[_type == "animesDetails"]{ "slug": slug.current }`)

  return { blogList, standardPosts, animes }
}

async function generateSitemap() {
  const { blogList, standardPosts, animes } = await getSlugs()

  const staticPaths = [``, `/about`]
  const dynamicPaths = [
    ...blogList.map(post => `/blog-list/${post.slug}`),
    ...standardPosts.map(post => `/blog-standard-post/${post.slug}`),
    ...animes.map(anime => `/anime/${anime.slug}`),
  ]

  const allPaths = [...staticPaths, ...dynamicPaths]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths.map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>`

  const filePath = path.join(process.cwd(), 'public', 'sitemap.xml')
  fs.writeFileSync(filePath, sitemap, 'utf8')
  console.log('✅ sitemap.xml generated successfully.')
}

generateSitemap().catch(console.error)
