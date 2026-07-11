'use client'

/* ──────────────────────────────────────────────────────────────
   Footer — 4-column grid: Brand · Studio · Services · Contact
   Bottom bar: copyright + legal links

   ► DROP YOUR REAL SOCIAL URLS INTO THE CONSTANT BELOW ◄
────────────────────────────────────────────────────────────── */

/* ── Social profile URLs ────────────────────────────────────────
   Replace the empty strings with your actual profile links.
   These are intentionally at the top of the file for easy editing.
──────────────────────────────────────────────────────────────── */
const SOCIAL_LINKS = {
  linkedin: '',   // e.g. https://linkedin.com/company/buildhive
  twitter:  '',   // e.g. https://twitter.com/buildhive
  dribbble: '',   // e.g. https://dribbble.com/buildhive
  github:   '',   // e.g. https://github.com/buildhive
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Gecko SVG mark — same as navbar */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <ellipse cx="14" cy="16" rx="5" ry="8" stroke="#7dc9e8" strokeWidth="1.5" />
        <circle cx="14" cy="6" r="4" stroke="#7dc9e8" strokeWidth="1.5" />
        <path d="M10 15 L4 11 M18 15 L24 11" stroke="#7dc9e8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 20 L4 25 M18 20 L24 25" stroke="#7dc9e8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 24 Q12 26 10 28" stroke="#7dc9e8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-display font-black text-[1.3rem] leading-none select-none">
        <span className="text-white">Build</span>
        <span className="text-glacier">Hive</span>
      </span>
    </div>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <path d="M8 11v5M8 8v.01M12 16v-5M12 13a2 2 0 0 1 4 0v3" />
    </svg>
  )
}

function TwitterXIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.918l4.258 5.632 5.818-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
    </svg>
  )
}

function DribbbleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72M10.48 21.72c2.04-6.16 2.8-10.3 1.65-17.27M2.62 10.5c5.29.9 8.92.52 13.4-1.16M21.47 12.1c-5.04 1.66-8.57 2.51-13.8.67" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
    </svg>
  )
}

/* ── Social links built from the constant above ─────────────── */
const socialLinks = [
  { label: 'LinkedIn',   icon: <LinkedInIcon />,  href: SOCIAL_LINKS.linkedin || 'https://linkedin.com' },
  { label: 'Twitter / X', icon: <TwitterXIcon />, href: SOCIAL_LINKS.twitter  || 'https://twitter.com'  },
  { label: 'Dribbble',   icon: <DribbbleIcon />,  href: SOCIAL_LINKS.dribbble || 'https://dribbble.com' },
  { label: 'GitHub',     icon: <GitHubIcon />,    href: SOCIAL_LINKS.github   || 'https://github.com'   },
]

/* ── Studio nav wired to real in-page anchors ───────────────── */
const studioLinks = [
  { label: 'About',    href: '/#services', hiring: false },
  { label: 'Services', href: '/#services', hiring: false },
  { label: 'Works',    href: '/#work',     hiring: false },
  { label: 'The Edge', href: '/#edge',     hiring: false },
  { label: 'Careers',  href: '/#contact',  hiring: true  },
]

/* ── Service links — scroll to Services section ─────────────── */
const serviceLinks = [
  { label: '3D Websites',      href: '/#services' },
  { label: 'UI/UX Design',     href: '/#services' },
  { label: 'Data Dashboards',  href: '/#services' },
  { label: 'Brand Experiences',href: '/#services' },
  { label: 'Digital Products', href: '/#services' },
]

/* ── Legal links — real pages ────────────────────────────────── */
const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy'  },
  { label: 'Terms',          href: '/terms'    },
  { label: 'Sitemap',        href: '/sitemap'  },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-night/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* 4-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8"
        >

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <BrandLogo />
            <p
              className="font-body text-white/50"
              style={{ fontSize: '13px', lineHeight: '1.65', maxWidth: '240px' }}
            >
              We build digital products that don&rsquo;t apologize for being excellent.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Studio */}
          <div className="flex flex-col gap-5">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase opacity-60">
              Studio
            </h4>
            <div
              className="w-8 h-px"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <nav className="flex flex-col gap-3">
              {studioLinks.map(({ label, href, hiring }) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  {label}
                  {hiring && (
                    <span
                      style={{
                        fontSize: '10px',
                        background: 'rgba(100,180,255,0.15)',
                        color: '#64b4ff',
                        borderRadius: '2px',
                        padding: '2px 6px',
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      Hiring
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Services */}
          <div className="flex flex-col gap-5">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase opacity-60">
              Services
            </h4>
            <div
              className="w-8 h-px"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <nav className="flex flex-col gap-3">
              {serviceLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 4 — Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="font-display font-semibold text-white text-sm tracking-wide uppercase opacity-60">
              Contact
            </h4>
            <div
              className="w-8 h-px"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@buildhive.studio"
                className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                hello@buildhive.studio
              </a>
              <p className="font-body text-sm text-white/60">Vijayawada, India</p>
              <p className="font-body text-sm text-white/60">Available for projects</p>
            </div>
            <div
              className="w-8 h-px"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-glacier to-deep text-white font-body font-semibold text-sm px-5 py-2 rounded-full hover:shadow-ice transition-shadow self-start"
            >
              Start a Project →
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '20px',
            marginTop: '48px',
          }}
        >
          <p className="font-body text-xs text-white/50">
            © 2026 BuildHive Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-body text-white/40 hover:text-white/70 transition-colors duration-200"
                style={{ fontSize: '12px' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
