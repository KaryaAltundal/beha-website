import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const services = [
  'Harita Mühendisliği',
  'Kadastro Hizmetleri',
  'İmar Uygulamaları',
  'Aplikasyon Hizmetleri',
  'Danışmanlık',
]

const placeholderFeatures = ['Placeholder Feature', 'Placeholder Feature', 'Placeholder Feature']

export function Services() {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches,
  )

  useEffect(() => {
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)')
    const updateInputMode = () => setIsTouchDevice(touchQuery.matches)

    updateInputMode()
    touchQuery.addEventListener('change', updateInputMode)
    return () => touchQuery.removeEventListener('change', updateInputMode)
  }, [])

  return (
    <section id="services" className="bg-white py-24 sm:py-32" aria-labelledby="services-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span data-nav-label className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">Hizmetlerimiz</span>
          <h2 id="services-heading" className="mt-4 text-[var(--color-heading)]">
            Profesyonel Harita ve Mühendislik Hizmetleri
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            Projelerinizin her aşamasına uygun, doğru veriye dayalı ve güvenilir mühendislik çözümleri sunuyoruz.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-8 md:grid-cols-2 lg:gap-10">
          {services.map((service) => {
            const isActive = activeService === service

            return (
              <motion.article
                key={service}
                layout
                onHoverStart={() => !isTouchDevice && setActiveService(service)}
                onHoverEnd={() => !isTouchDevice && setActiveService(null)}
                onClick={() => isTouchDevice && setActiveService((active) => (active === service ? null : service))}
                onKeyDown={(event) => {
                  if (isTouchDevice && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    setActiveService((active) => (active === service ? null : service))
                  }
                }}
                role={isTouchDevice ? 'button' : undefined}
                tabIndex={isTouchDevice ? 0 : undefined}
                aria-expanded={isTouchDevice ? isActive : undefined}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                whileHover={isTouchDevice ? undefined : { y: -3, boxShadow: '0 14px 32px rgba(15, 23, 42, 0.09)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="overflow-hidden bg-slate-100">
                  <motion.div
                    className="flex aspect-video items-center justify-center text-sm font-medium text-[var(--color-muted)]"
                    animate={{ scale: isActive ? 1.03 : 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    Service Image
                  </motion.div>
                </div>

                <div className="flex items-center justify-between gap-4 p-6">
                  <h3
                    className={`text-xl transition-colors duration-300 ${
                      isActive ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-heading)]'
                    }`}
                  >
                    {service}
                  </h3>
                  <motion.span
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-primary-600)]"
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="border-t border-[var(--color-border)] px-6 pb-6 pt-5"
                      >
                        <p className="text-[var(--color-body)]">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                          labore et dolore magna aliqua.
                        </p>
                        <ul className="mt-4 space-y-2.5 text-[var(--color-body)]">
                          {placeholderFeatures.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#4B83B4]" aria-hidden="true" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
