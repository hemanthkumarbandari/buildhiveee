import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitemap — BuildHive Studio',
  description: 'All pages on the BuildHive Studio website.',
}

const sections = [
  {
    title: 'Main Site',
    links: [
      { label: 'Home',        href: '/'           },
      { label: 'Services',    href: '/#services'  },
      { label: 'The Proof',   href: '/#work'      },
      { label: 'The Edge',    href: '/#edge'      },
      { label: 'Contact',     href: '/#contact'   },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms'   },
      { label: 'Sitemap',          href: '/sitemap' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-night text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-glacier transition-colors mb-12"
        >
          ← Back to BuildHive
        </Link>

        <p className="font-body text-glacier text-xs font-semibold tracking-widest uppercase mb-4">
          Navigation
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-12">
          Sitemap
        </h1>

        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display font-semibold text-white/50 text-xs tracking-widest uppercase mb-5">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-3 font-body text-lg text-white/70 hover:text-white transition-colors"
                    >
                      <span className="w-4 h-px bg-glacier/40 group-hover:w-8 group-hover:bg-glacier transition-all duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom contact nudge */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="font-body text-white/40 text-sm mb-4">
            Can&rsquo;t find what you&rsquo;re looking for?
          </p>
          <a
            href="mailto:hello@buildhive.studio"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-glacier to-deep text-white font-body font-semibold text-sm px-5 py-2 rounded-full hover:shadow-ice transition-shadow"
          >
            hello@buildhive.studio →
          </a>
        </div>

      </div>
    </main>
  )
}
