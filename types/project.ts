export interface ProjectStat {
  value: string
  label: string
}

export interface Project {
  id: string
  index: string
  title: string
  category: string
  url: string
  domain: string
  description: string
  stats: ProjectStat[]
  mockupAccent: string
}
