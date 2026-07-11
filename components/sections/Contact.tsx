'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import MagneticButton from '@/components/ui/MagneticButton'

const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(6,16,24,0.5)',
      }}
    >
      <div
        className="animate-spin"
        style={{
          width: '48px',
          height: '48px',
          border: '2px solid rgba(99,184,255,0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
        }}
      />
    </div>
  ),
})

const contactSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  service: z.string().min(1, 'Required'),
  message: z.string().min(20, 'Tell us more (at least 20 chars)'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const errorVariant = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.25 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // Removing isMobile JS state to prevent hydration errors and layout flash

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true)
    try {
      // TODO: Replace with real API endpoint, e.g. fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
      await new Promise((r) => setTimeout(r, 1200))
      setSubmitted(true)
    } catch (err) {
      console.error('Form submission failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative z-10 border-t border-[var(--border)]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen items-center max-w-[100vw] overflow-hidden">
        {/* Left column — Lanyard */}
        <div className="h-[50vh] lg:h-screen w-full relative overflow-hidden flex items-center justify-center">
          <Lanyard
            position={[0, 0, 24]}
            gravity={[0, -40, 0]}
            frontImage="/buildhive-card.png?v=2"
            imageFit="cover"
            lanyardWidth={1}
          />
        </div>

        {/* Right column — Contact form */}
        <div className="px-6 py-10 lg:px-[60px] lg:py-[80px] flex flex-col gap-8 w-full">
          <div>
            <p className="font-body text-[var(--primary)] text-sm font-semibold tracking-widest uppercase mb-3">
              CONTACT
            </p>
            <h2 className="font-display font-bold text-5xl md:text-6xl text-[var(--text)] leading-tight">
              Let&apos;s build<br />something real.
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start py-16 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                >
                  <CheckCircle size={56} className="text-glacier" />
                </motion.div>
                <h3 className="font-display font-bold text-2xl text-white">Message received.</h3>
                <p className="font-body text-base text-white/60 max-w-sm">
                  We read every brief. Expect a reply within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      {...register('name')}
                      placeholder="Name"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '2px',
                        padding: '14px 16px',
                        fontSize: '14px',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(100,180,255,0.3)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p variants={errorVariant} initial="hidden" animate="visible" exit="exit" className="font-body text-xs text-red-400 mt-1">
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '2px',
                        padding: '14px 16px',
                        fontSize: '14px',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(100,180,255,0.3)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p variants={errorVariant} initial="hidden" animate="visible" exit="exit" className="font-body text-xs text-red-400 mt-1">
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <input
                    {...register('service')}
                    placeholder="Project type"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '2px',
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#fff',
                      width: '100%',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(100,180,255,0.3)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <AnimatePresence>
                    {errors.service && (
                      <motion.p variants={errorVariant} initial="hidden" animate="visible" exit="exit" className="font-body text-xs text-red-400 mt-1">
                        {errors.service.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <textarea
                    {...register('message')}
                    placeholder="Message"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '2px',
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#fff',
                      width: '100%',
                      minHeight: '120px',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(100,180,255,0.3)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p variants={errorVariant} initial="hidden" animate="visible" exit="exit" className="font-body text-xs text-red-400 mt-1">
                        {errors.message.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <MagneticButton className="self-start">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-glacier to-deep text-white font-body font-semibold px-8 py-3.5 rounded-full hover:shadow-ice transition-shadow disabled:opacity-60"
                  >
                    <motion.span animate={submitting ? { opacity: [1, 0.5, 1] } : {}}>
                      {submitting ? 'Sending...' : 'Send Message →'}
                    </motion.span>
                  </button>
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
