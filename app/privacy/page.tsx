import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — BuildHive Studio',
  description: 'Privacy Policy for BuildHive Studio.',
}

export default function PrivacyPage() {
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
          Legal
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
          Privacy Policy
        </h1>
        <p className="font-body text-white/40 text-sm mb-12">
          Last updated: July 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 font-body text-white/70 leading-relaxed">

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">Overview</h2>
            <p>
              BuildHive Studio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your
              privacy. This policy explains what information we collect when you visit{' '}
              <span className="text-glacier">buildhive.studio</span>, how we use it, and your rights
              regarding that information.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white/90">Contact form submissions</strong> — name, email address,
                and message content you voluntarily provide.
              </li>
              <li>
                <strong className="text-white/90">Usage data</strong> — anonymised analytics (page views,
                referral sources) via privacy-respecting tooling. No cross-site tracking.
              </li>
              <li>
                <strong className="text-white/90">Cookies</strong> — strictly necessary cookies only
                (session management). No advertising cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">How We Use It</h2>
            <p>
              Information collected is used solely to respond to project enquiries and improve the site
              experience. We do not sell, rent, or share personal data with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">Data Retention</h2>
            <p>
              Contact enquiries are retained for up to 12 months then permanently deleted unless an active
              project relationship is ongoing.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of any personal data we hold about you
              by emailing{' '}
              <a
                href="mailto:hello@buildhive.studio"
                className="text-glacier hover:underline"
              >
                hello@buildhive.studio
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">Contact</h2>
            <p>
              Questions about this policy? Reach us at{' '}
              <a
                href="mailto:hello@buildhive.studio"
                className="text-glacier hover:underline"
              >
                hello@buildhive.studio
              </a>.
            </p>
          </section>

        </div>

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-xs text-white/30">
          <Link href="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
          <Link href="/sitemap" className="hover:text-white/60 transition-colors">Sitemap</Link>
          <Link href="/"        className="hover:text-white/60 transition-colors">Home</Link>
        </div>

      </div>
    </main>
  )
}
