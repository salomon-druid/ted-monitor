import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ted-monitor-six.vercel.app'

  const branches = [
    { slug: 'bau', priority: 0.8 },
    { slug: 'it', priority: 0.8 },
    { slug: 'facility', priority: 0.8 },
    { slug: 'beratung', priority: 0.8 },
    { slug: 'medical', priority: 0.8 },
    { slug: 'energy', priority: 0.8 },
    { slug: 'security', priority: 0.8 },
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/notices`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...branches.map((b) => ({
      url: `${baseUrl}/branche/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: b.priority,
    })),
  ]
}
