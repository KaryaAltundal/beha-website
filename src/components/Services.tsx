import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage, type Language } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

type Service = { title: string; image: string; description: string }

const servicesByLanguage: Record<Language, Service[]> = {
  tr: [
    {
      title: 'Veri Toplama ve Uzaktan Algılama',
      image: '/web/Veri Toplama ve Uzaktan Algılama.jpg',
      description:
        'İHA, GNSS, LiDAR, fotogrametri ve benzeri modern teknolojiler kullanılarak yüksek doğrulukta konumsal veri toplanmaktadır. Elde edilen veriler; haritalama, arazi analizi, 3B modelleme ve mühendislik projelerine yönelik işlenerek karar destek süreçlerine hazır hale getirilmektedir.',
    },
    {
      title: '1., 2. ve 3. Sınıf Düzenli Depolama Tesisleri (Lot) Projelendirme Hizmetleri',
      image: '/web/1., 2. ve 3. Sınıf Düzenli Depolama Tesisleri (Lot) Projelendirme Hizmetleri.jpg',
      description:
        'Düzenli depolama tesislerinin ihtiyaçlarına yönelik topografik, geometrik ve mühendislik verileri değerlendirilerek proje altyapısı oluşturulmaktadır. Lot tasarımı, arazi düzenlemesi, kapasite hesapları ve uygulamaya esas teknik çalışmalar ilgili standart ve mevzuat doğrultusunda yürütülmektedir.',
    },
    {
      title: 'Plankote ve Hâlihazır Harita Üretimi',
      image: '/web/Plankote ve Hâlihazır Harita Üretimi.jpg',
      description:
        'Araziye ait mevcut topoğrafik ve yapısal unsurların yüksek doğrulukta ölçülerek sayısal ortamda modellenmesi sağlanmaktadır. Proje ihtiyaçlarına uygun ölçekte plankote ve hâlihazır haritalar hazırlanarak mühendislik ve tasarım çalışmalarına güvenilir altlık sunulmaktadır.',
    },
    {
      title: 'Batimetrik ve Hidrografik Ölçümler',
      image: '/web/Batimetrik ve Hidrografik Ölçümler.jpg',
      description:
        'Göl, gölet, baraj, nehir ve benzeri su alanlarında su altı topoğrafyasının belirlenmesine yönelik batimetrik ve hidrografik ölçümler gerçekleştirilmektedir. Elde edilen veriler kullanılarak derinlik haritaları, su altı yüzey modelleri ve mühendislik projelerine yönelik sayısal çıktılar oluşturulmaktadır.',
    },
    {
      title: 'Kamulaştırma ve Sayısal Kadastro Çalışmaları',
      image: '/web/Kamulaştırma ve Sayısal Kadastro Çalışmaları.jpg',
      description:
        'Kamulaştırma süreçlerine yönelik arazi ve mülkiyet verileri hassas ölçüm teknikleriyle toplanarak sayısal ortamda düzenlenmektedir. Kadastro verilerinin analizi, parsel bazlı çalışmalar ve proje ihtiyaçlarına uygun teknik harita üretimleri gerçekleştirilerek güvenilir bir veri altyapısı oluşturulmaktadır.',
    },
    {
      title: 'Arazi ve Mühendislik Ölçmeleri',
      image: '/web/Arazi ve Mühendislik Ölçmeleri.jpg',
      description:
        'İnşaat, altyapı, üstyapı ve çeşitli mühendislik projeleri için gerekli arazi ölçmeleri yüksek doğruluklu ölçüm sistemleri kullanılarak gerçekleştirilmektedir. Aplikasyon, kot ve koordinat ölçümleri, kesit çalışmaları, hacim hesapları ve projeye özel diğer ölçme hizmetleri sunulmaktadır.',
    },
  ],
  en: [
    {
      title: 'Data Collection and Remote Sensing',
      image: '/web/Veri Toplama ve Uzaktan Algılama.jpg',
      description:
        'High-precision spatial data is collected using UAVs, GNSS, LiDAR, photogrammetry, and similar modern technologies. The data obtained is processed for mapping, land analysis, 3D modeling, and engineering projects, and made ready for decision-support processes.',
    },
    {
      title: 'Class 1, 2, and 3 Sanitary Landfill (Lot) Design Services',
      image: '/web/1., 2. ve 3. Sınıf Düzenli Depolama Tesisleri (Lot) Projelendirme Hizmetleri.jpg',
      description:
        'Topographic, geometric, and engineering data are evaluated to meet the needs of sanitary landfill facilities, forming the basis of the project infrastructure. Lot design, land grading, capacity calculations, and other technical studies required for implementation are carried out in line with relevant standards and regulations.',
    },
    {
      title: 'Spot-Height Survey (Plankote) and Base Map Production',
      image: '/web/Plankote ve Hâlihazır Harita Üretimi.jpg',
      description:
        'Existing topographic and structural features of the land are measured with high precision and modeled digitally. Spot-height surveys and base maps are prepared at a scale suited to project needs, providing a reliable base for engineering and design work.',
    },
    {
      title: 'Bathymetric and Hydrographic Surveys',
      image: '/web/Batimetrik ve Hidrografik Ölçümler.jpg',
      description:
        'Bathymetric and hydrographic surveys are carried out to determine underwater topography in lakes, ponds, dams, rivers, and similar water bodies. The data obtained is used to produce depth maps, underwater surface models, and digital outputs for engineering projects.',
    },
    {
      title: 'Expropriation and Digital Cadastral Studies',
      image: '/web/Kamulaştırma ve Sayısal Kadastro Çalışmaları.jpg',
      description:
        'Land and ownership data for expropriation processes are collected using precise measurement techniques and organized digitally. Cadastral data analysis, parcel-based studies, and technical map production suited to project needs are carried out to build a reliable data infrastructure.',
    },
    {
      title: 'Land and Engineering Surveys',
      image: '/web/Arazi ve Mühendislik Ölçmeleri.jpg',
      description:
        'Land surveys required for construction, infrastructure, superstructure, and various engineering projects are carried out using high-precision measurement systems. Staking, elevation and coordinate measurements, cross-section studies, volume calculations, and other project-specific surveying services are provided.',
    },
  ],
}

export function Services() {
  const { language } = useLanguage()
  const t = translations[language]
  const services = servicesByLanguage[language]
  const [activeService, setActiveService] = useState<number | null>(null)
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
          <span data-nav-label className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">{t.services.eyebrow}</span>
          <h2 id="services-heading" className="mt-4 text-[var(--color-heading)]">
            {t.services.heading}
          </h2>
          <p className="body-large mt-5 text-[var(--color-body)]">
            {t.services.paragraph}
          </p>
        </div>

        <div className="mt-16 grid items-start gap-8 md:grid-cols-2 lg:gap-10">
          {services.map((service, index) => {
            const isActive = activeService === index

            return (
              <motion.article
                key={service.image}
                layout
                onHoverStart={() => !isTouchDevice && setActiveService(index)}
                onHoverEnd={() => !isTouchDevice && setActiveService(null)}
                onClick={() => isTouchDevice && setActiveService((active) => (active === index ? null : index))}
                onKeyDown={(event) => {
                  if (isTouchDevice && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    setActiveService((active) => (active === index ? null : index))
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
                    className="aspect-video"
                    animate={{ scale: isActive ? 1.03 : 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <img
                      src={encodeURI(service.image)}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between gap-4 p-6">
                  <h3
                    className={`text-xl transition-colors duration-300 ${
                      isActive ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-heading)]'
                    }`}
                  >
                    {service.title}
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
                        <p className="text-[var(--color-body)]">{service.description}</p>
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
