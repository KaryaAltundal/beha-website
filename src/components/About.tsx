import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'
import { SurveyNetwork } from './SurveyNetwork'

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [query])

  return matches
}

export function About() {
  const { language } = useLanguage()
  const t = translations[language]
  const rightColRef = useRef<HTMLDivElement | null>(null)
  const [matchedHeight, setMatchedHeight] = useState<number | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Side-by-side only from lg up — measure the text column's real rendered
  // height ("Neden BEHA?" through the last list item) and pin the emblem box
  // to that exact pixel value, rather than trusting CSS grid stretch to agree
  // with the browser's own object-fit sizing for the image.
  useEffect(() => {
    if (!isDesktop) {
      setMatchedHeight(null)
      return
    }

    const el = rightColRef.current
    if (!el) return

    const updateHeight = () => setMatchedHeight(el.getBoundingClientRect().height)
    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)

    return () => observer.disconnect()
  }, [isDesktop])

  return (
    <section id="about" className="bg-white py-24 sm:py-32" aria-labelledby="about-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span data-nav-label className="text-sm font-semibold uppercase tracking-[0.02em] text-[var(--color-primary-600)]">
            {t.about.eyebrow}
          </span>
          <h2 id="about-heading" className="mt-4 text-[var(--color-heading)]">
            {t.about.heading}
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            {t.about.paragraph}
          </p>
        </motion.div>

        <SurveyNetwork />

        <motion.div
          className="mt-24 grid items-start gap-12 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            className="relative flex aspect-[4/5] items-center justify-center lg:aspect-auto"
            style={matchedHeight ? { height: matchedHeight } : undefined}
            variants={reveal}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.img
              src="/beha_logo_2.svg"
              alt={t.about.emblemAlt}
              className="relative h-full w-auto"
              whileHover={{ scale: 1.035 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </motion.div>

          <motion.div ref={rightColRef} variants={reveal} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2>{t.about.whyHeading}</h2>
            <p className="body-large mt-5 text-[var(--color-body)]">
              {t.about.whyParagraph}
            </p>

            <ul className="mt-8 space-y-4">
              {t.about.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 font-medium text-[var(--color-heading)]">
                  <span className="flex h-5 w-5 items-center justify-center text-sm font-semibold text-[#4B83B4]" aria-hidden="true">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
