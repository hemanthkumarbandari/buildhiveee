import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: 'iquantum',
    index: '01',
    title: 'iQuantum',
    category: 'Education Platform',
    url: 'https://iquantum.nuhvin.com',
    domain: 'iquantum.nuhvin.com',
    description:
      'Quantum computing education platform with interactive lessons and modern learning experiences.',
    stats: [
      { value: 'Live', label: 'Interactive modules' },
      { value: '3D', label: 'Visual learning' },
      { value: 'Web', label: 'Cross-platform' },
    ],
    mockupAccent: '#63b8ff',
  },
  {
    id: 'sophrion',
    index: '02',
    title: 'Sophrion',
    category: 'Corporate Web',
    url: 'https://sophrion.co.in',
    domain: 'sophrion.co.in',
    description:
      'Corporate web presence with premium brand storytelling and conversion-focused design.',
    stats: [
      { value: 'B2B', label: 'Enterprise ready' },
      { value: 'SEO', label: 'Optimized' },
      { value: 'Fast', label: 'Performance' },
    ],
    mockupAccent: '#3f9cff',
  },
  {
    id: 'pshashivardhan',
    index: '03',
    title: 'P. Shashi Vardhan',
    category: 'Portfolio',
    url: 'https://pshashivardhan.vercel.app/',
    domain: 'pshashivardhan.vercel.app',
    description:
      'Developer portfolio showcasing projects, skills, and professional experience.',
    stats: [
      { value: 'Dev', label: 'Full-stack' },
      { value: 'UI', label: 'Polished UX' },
      { value: 'Vercel', label: 'Deployed' },
    ],
    mockupAccent: '#7dc9e8',
  },
  {
    id: 'hemanthkumarbandari',
    index: '04',
    title: 'Hemanth Kumar Bandari',
    category: 'Portfolio',
    url: 'https://bhemanth.vercel.app/',
    domain: 'bhemanth.vercel.app',
    description:
      'Personal portfolio with project highlights, case studies, and contact integration.',
    stats: [
      { value: 'Work', label: 'Case studies' },
      { value: 'Mobile', label: 'Responsive' },
      { value: 'Fast', label: 'Lighthouse' },
    ],
    mockupAccent: '#63b8ff',
  },
  {
    id: 'meetnow',
    index: '05',
    title: 'MeetNow',
    category: 'Digital Product',
    url: 'https://meetnow.nuhvin.com/',
    domain: 'meetnow.nuhvin.com',
    description:
      'Real-time meeting and collaboration platform for teams and remote workflows.',
    stats: [
      { value: 'Live', label: 'Real-time' },
      { value: 'Teams', label: 'Collaboration' },
      { value: 'SaaS', label: 'Product' },
    ],
    mockupAccent: '#3f9cff',
  },
  {
    id: 'ros',
    index: '06',
    title: 'ROS Platform',
    category: 'Robotics',
    url: 'https://ros.nuhvin.com/',
    domain: 'ros.nuhvin.com',
    description:
      'Robotics operating system tooling hub with documentation and developer resources.',
    stats: [
      { value: 'ROS', label: 'Robotics' },
      { value: 'Docs', label: 'Developer hub' },
      { value: 'API', label: 'Integrated' },
    ],
    mockupAccent: '#63b8ff',
  },
]
