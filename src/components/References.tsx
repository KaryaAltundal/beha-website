import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const references = ['ABC İnşaat', 'XYZ Gayrimenkul', 'Delta Yapı', 'Atlas Mühendislik', 'Nova Proje', 'Kent Planlama']

export function References() {
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
            Referanslarımız
          </span>
          <h2 id="references-heading" className="mt-4 text-[var(--color-heading)]">
            Güvenle Birlikte Çalıştığımız Kurumlar
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            Farklı sektörlerdeki iş ortaklarımızla güvene dayalı, uzun soluklu ve başarılı projeler yürütüyoruz.
          </p>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="mt-16 grid gap-5 md:grid-cols-2"
          initial="hidden"
          animate={isGridInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {references.map((reference) => (
            <motion.article
              key={reference}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -3, boxShadow: '0 14px 32px rgba(15, 23, 42, 0.09)' }}
              className="group flex min-h-32 items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
            >
              <motion.div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-medium text-[var(--color-muted)] transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              >
                Logo
              </motion.div>
              <h3 className="text-xl transition-colors duration-300 group-hover:text-[var(--color-primary-600)]">
                {reference}
              </h3>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
