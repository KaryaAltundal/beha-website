import { motion } from 'framer-motion'
import { SurveyNetwork } from './SurveyNetwork'

const features = ['Modern Teknoloji', 'Deneyimli Ekip', 'Hassas Ölçüm', 'Güvenilir Hizmet']

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function About() {
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
            Hakkımızda
          </span>
          <h2 id="about-heading" className="mt-4 text-[var(--color-heading)]">
            Harita Mühendisliğinde Güvenilir Çözüm Ortağınız
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            BEHA, her projeye titiz planlama ve doğru ölçüm yaklaşımıyla değer katar. Deneyimli ekibimiz,
            güncel teknolojilerle güvenilir sonuçlar üretirken iş ortaklarımızın ihtiyaçlarını dikkatle dinler.
            Sürdürülebilir ve şeffaf hizmet anlayışımızla, projelerinizi güvenle geleceğe taşırız.
          </p>
        </motion.div>

        <SurveyNetwork />

        <motion.div
          className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium text-[var(--color-muted)]"
            variants={reveal}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Şirket Görseli
          </motion.div>

          <motion.div variants={reveal} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2>Neden BEHA?</h2>
            <p className="body-large mt-5 text-[var(--color-body)]">
              Projelerinizin her aşamasında teknik doğruluk, açık iletişim ve zamanında teslim ilkeleriyle yanınızdayız.
              İhtiyaçlarınıza özel çözümler üreterek güvenilir bir iş ortaklığı kuruyoruz.
            </p>

            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
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
