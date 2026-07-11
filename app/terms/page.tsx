import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — BuildHive Studio',
  description: 'Terms of Service for BuildHive Studio.',
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="font-body text-white/40 text-sm mb-12">
          Last updated: July 2026
        </p>

        <div className="space-y-8 font-body text-white/70 leading-relaxed">

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">1. Acceptance</h2>
            <p>
              By engaging BuildHive Studio for services or using this website you agree to these Terms. If
              you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">2. Services</h2>
            <p>
              BuildHive Studio provides web design, development, and digital product services under scopes
              agreed in individual project proposals or contracts. The specific deliverables, timelines, and
              payment terms are defined per project agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">3. Intellectual Property</h2>
            <p>
              Upon full payment, the client receives ownership of all custom work product created for their
              project. BuildHive Studio retains the right to display the work in its portfolio unless
              specifically agreed otherwise in writing.
            </p>
            <p className="mt-3">
              Third-party libraries, fonts, and assets incorporated in your project are subject to their
              respective licences.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">4. Payment</h2>
            <p>
              Invoices are due within the timeline specified in each project agreement. Overdue invoices may
              result in work being paused until payment is received.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">5. Limitation of Liability</h2>
            <p>
              BuildHive Studio&rsquo;s liability is limited to the fees paid for the specific project in
              question. We are not liable for indirect, consequential, or incidental damages.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Disputes will be resolved under the jurisdiction
              of courts in Andhra Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-white text-xl mb-3">7. Contact</h2>
            <p>
              Questions?{' '}
              <a
                href="mailto:hello@buildhive.studio"
                className="text-glacier hover:underline"
              >
                hello@buildhive.studio
              </a>
            </p>
          </section>

        </div>

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-xs text-white/30">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          <Link href="/sitemap" className="hover:text-white/60 transition-colors">Sitemap</Link>
          <Link href="/"        className="hover:text-white/60 transition-colors">Home</Link>
        </div>

      </div>
    </main>
  )
}
