'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'
import type { SitePreview } from '@/types/sitePreview'

const PREVIEW_WIDTH = 1280
const PREVIEW_HEIGHT = 800
const PREVIEW_SCALE = 0.42

interface PreviewBrowserCardProps {
  site: SitePreview
  isActive?: boolean
  isNeighbor?: boolean
  onActivate?: () => void
  className?: string
}

export default function PreviewBrowserCard({
  site,
  isActive = false,
  isNeighbor = false,
  onActivate,
  className,
}: PreviewBrowserCardProps) {
  const [cardRef, inView] = useInView<HTMLDivElement>({ rootMargin: '200px', once: false })
  const [loadIframe, setLoadIframe] = useState(false)
  const [iframeFailed, setIframeFailed] = useState(false)
  const failTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accent = site.accent ?? 'var(--primary)'
  const scaledW = PREVIEW_WIDTH * PREVIEW_SCALE
  const scaledH = PREVIEW_HEIGHT * PREVIEW_SCALE

  useEffect(() => {
    if (inView) setLoadIframe(true)
  }, [inView])

  useEffect(() => {
    if (!loadIframe || iframeFailed) return
    failTimer.current = setTimeout(() => setIframeFailed(true), 6000)
    return () => {
      if (failTimer.current) clearTimeout(failTimer.current)
    }
  }, [loadIframe, iframeFailed])

  const handleIframeLoad = () => {
    if (failTimer.current) clearTimeout(failTimer.current)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex-shrink-0 w-[min(88vw,520px)] transition-all duration-500 ease-out',
        isActive ? 'scale-100 opacity-100 z-10' : isNeighbor ? 'scale-[0.94] opacity-50' : 'scale-[0.9] opacity-35',
        className
      )}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
    >
      <div
        className={cn(
          'rounded-2xl overflow-hidden border transition-all duration-400 glass-dark',
          isActive
            ? 'border-[var(--primary)]/40 shadow-[0_24px_64px_rgba(0,0,0,0.5)]'
            : 'border-[var(--border)]'
        )}
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          <div className="flex-1 ml-2 bg-white/5 rounded-md px-3 py-1 text-[10px] font-body text-[var(--text-secondary)] text-center truncate">
            {site.domain}
          </div>
        </div>

        <div
          className="relative overflow-hidden bg-[var(--bg-start)] mx-auto"
          style={{ width: scaledW, height: scaledH, maxWidth: '100%' }}
        >
          {loadIframe && !iframeFailed ? (
            <iframe
              src={site.url}
              title={site.title}
              className={cn(
                'product-preview-frame absolute top-0 left-0 border-0',
                isActive && 'is-interactive'
              )}
              style={{
                width: PREVIEW_WIDTH,
                height: PREVIEW_HEIGHT,
                transform: `scale(${PREVIEW_SCALE})`,
              }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={handleIframeLoad}
              onError={() => setIframeFailed(true)}
            />
          ) : iframeFailed ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
              style={{
                background: `linear-gradient(135deg, var(--bg-mid), ${accent}22)`,
              }}
            >
              <div className="w-16 h-16 rounded-xl opacity-60" style={{ background: `${accent}44` }} />
              <p className="font-display font-bold text-xl text-[var(--text)]">{site.title}</p>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:opacity-80"
              >
                Visit site
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div className="absolute inset-0 animate-pulse bg-[var(--card)]" />
          )}
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)]">
          <h3 className="font-display font-bold text-lg text-[var(--text)]">{site.title}</h3>
          {site.description && (
            <p className="font-body text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
              {site.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
