import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const contactDetails = [
  {
    label: 'Adres',
    content: (
      <>
        Ceyhun Atuf Kansu Cad.
        <br />
        1244. Sok. No:6/1
        <br />
        Çankaya / Ankara
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Telefon',
    content: '(0312) 473 21 33',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 2 2.3Z" />
      </svg>
    ),
  },
  {
    label: 'E-posta',
    content: 'cemvur@behainsaat.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'Çalışma Saatleri',
    content: (
      <>
        Pazartesi - Cuma
        <br />
        09:00 – 18:00
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
]

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Contact() {
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
    <section
      id="contact"
      className="flex min-h-[calc(100svh-88px)] flex-col justify-center bg-white py-24 sm:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">İletişim</span>
          <h2 id="contact-heading" className="mt-4 text-[var(--color-heading)]">
            Bizimle İletişime Geçin
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            Projeleriniz ve hizmetlerimiz hakkında bilgi almak için ekibimizle dilediğiniz zaman iletişime geçebilirsiniz.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid items-start gap-8 lg:grid-cols-2 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={reveal} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <motion.div
              initial={isTouchDevice ? 'touch' : 'default'}
              animate={isTouchDevice ? 'touch' : 'default'}
              whileHover={isTouchDevice ? undefined : 'hover'}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
            >
              <motion.iframe
                title="BEHA İnşaat konumu"
                src="https://www.google.com/maps?q=Ceyhun%20Atuf%20Kansu%20Cad.%201244.%20Sok.%20No%3A6%2F1%20%C3%87ankaya%20Ankara&output=embed"
                className="aspect-[4/3] w-full"
                loading="lazy"
                variants={{
                  default: {
                    filter: 'grayscale(0.72) sepia(0.16) hue-rotate(160deg) saturate(0.7) brightness(1.06) contrast(0.95)',
                  },
                  hover: { filter: 'grayscale(0) sepia(0) hue-rotate(0deg) saturate(1) brightness(1) contrast(1)' },
                  touch: { filter: 'grayscale(0) sepia(0) hue-rotate(0deg) saturate(1) brightness(1) contrast(1)' },
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </motion.div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Ceyhun%20Atuf%20Kansu%20Cad.%201244.%20Sok.%20No%3A6%2F1%20%C3%87ankaya%20Ankara"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-[var(--color-primary-600)] transition-colors duration-200 hover:text-[var(--color-primary-500)]"
            >
              Google Maps'te Aç →
            </a>
          </motion.div>

          <motion.article
            variants={reveal}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -4, boxShadow: '0 14px 32px rgba(15, 23, 42, 0.09)' }}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-8"
          >
            <div className="space-y-7">
              {contactDetails.map((detail) => (
                <div key={detail.label} className="flex gap-4">
                  <span className="mt-0.5 h-5 w-5 shrink-0 text-[#4B83B4]">{detail.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-heading)]">{detail.label}</p>
                    <p className="mt-1 text-[var(--color-body)]">{detail.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
