export interface ServiceCarouselItem {
  id: string
  label: string
  subtitle: string
  description: string
  /** Place image at this path under /public — e.g. /services/website.jpg */
  image: string
  accent: string
  categories: string[]
}
