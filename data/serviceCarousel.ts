import type { ServiceCarouselItem } from '@/types/serviceCarousel'

/**
 * Drop your images into /public/services/ using these filenames.
 * Supported: .jpg, .jpeg, .png, .webp, .svg
 */
export const serviceCarouselItems: ServiceCarouselItem[] = [
  {
    id: 'website',
    label: 'Websites',
    subtitle: 'Brand-forward sites',
    description:
      'High-performance marketing sites, landing pages, and WebGL experiences built to convert.',
    image: '/services/website.png',
    accent: '#63b8ff',
    categories: ['Landing Pages', 'Marketing Sites', 'E-Commerce', 'Webflow', 'Next.js', '3D/WebGL'],
  },
  {
    id: 'products',
    label: 'Products',
    subtitle: 'SaaS & apps',
    description:
      'End-to-end digital products — strategy, design, and engineering that ships on schedule.',
    image: '/services/product.png',
    accent: '#7dc9e8',
    categories: ['SaaS MVPs', 'Web Apps', 'Mobile Apps', 'AI Agents', 'UI/UX Design', 'API Integration'],
  },
  {
    id: 'portfolios',
    label: 'Portfolios',
    subtitle: 'Showcase experiences',
    description:
      'Portfolio platforms and personal brands with motion, depth, and memorable storytelling.',
    image: '/services/portfolio.png',
    accent: '#3f9cff',
    categories: ['Personal Brands', 'Creative Portfolios', 'Agency Sites', 'Interactive', 'Case Studies', 'Motion'],
  },
  {
    id: 'data',
    label: 'Data analytics',
    subtitle: 'Live dashboards',
    description:
      'Real-time analytics, custom visualisations, and decision-ready data interfaces.',
    image: '/services/data-analytics.png',
    accent: '#63b8ff',
    categories: ['Live Dashboards', 'Data Visualization', 'Reporting', 'Real-time Metrics', 'Custom BI', 'Interactive Charts'],
  },
  {
    id: 'admin',
    label: 'Admin panels',
    subtitle: 'Internal tools',
    description:
      'Scalable admin dashboards, multi-tenant SaaS backends, and operations tooling.',
    image: '/services/admin.png',
    accent: '#c1cedb',
    categories: ['Internal Tools', 'Custom CMS', 'CRM Systems', 'User Management', 'Inventory', 'Multi-tenant'],
  },
]
