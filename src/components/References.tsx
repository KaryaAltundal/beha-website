import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

// Company name (used only for alt text now) comes straight from each file's
// name in public/logolar/. The three that were flattened JPGs with a baked-in
// white background got a transparent .png twin (background-removed) so they
// blend into the card like the rest — see /logolar for both copies.
const references = [
  { name: 'AGM Proje', src: '/logolar/AGM Proje .png' },
  { name: 'Aselsan Net', src: '/logolar/Aselsan Net.png' },
  { name: 'Aselsan', src: '/logolar/aselsan_yeni.png' },
  { name: 'Atlas Enerji', src: '/logolar/Atlas Enerji.png' },
  { name: 'Frea Mimarlık', src: '/logolar/Frea Mimarlık.png' },
  { name: 'Havelsan', src: '/logolar/Havelsan.svg' },
  { name: 'ITC', src: '/logolar/ITC.png' },
  { name: 'MVM Mimarlık', src: '/logolar/MVM Mimarlık.png' },
  { name: 'Çimentaş', src: '/logolar/Çimentaş.png' },
  { name: 'İzaydaş', src: '/logolar/İzaydaş.png' },
]

export function References() {
  const { language } = useLanguage()
  const t = translations[language]
  const gridRef = useRef<HTMLDivElement | null>(null)
  const isGridInView = useInView(gridRef, { amount: 0.2 })

  return (
    <section
      id="references"
      className="flex min-h-[calc(100svh-88px)] flex-col justify-center bg-white py-24 sm:py-32"
      aria-labelledby="references-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span data-nav-label className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">
            {t.references.eyebrow}
          </span>
          <h2 id="references-heading" className="mt-4 text-[var(--color-heading)]">
            {t.references.heading}
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            {t.references.paragraph}
          </p>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
          initial="hidden"
          animate={isGridInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {references.map((reference) => (
            <motion.article
              key={reference.name}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="group flex min-h-32 items-center justify-center p-5"
            >
              <motion.div
                className="flex h-32 w-32 shrink-0 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              >
                <img
                  src={encodeURI(reference.src)}
                  alt={reference.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
