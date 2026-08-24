import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PointCloudLightbox } from './PointCloudModal'
import { useLanguage, type Language } from '../i18n/LanguageContext'
import { translations, type Translations } from '../i18n/translations'

type Media = { type: 'image' | 'video'; src: string }

type Project = {
  id: string
  title: string
  city: string
  type: string
  services: string[]
  description: string
  media: Media[]
  /** Web-ready .ply under public/pointclouds; opens the 3D viewer when present. */
  pointCloud?: string
}

const projectsByLanguage: Record<Language, Project[]> = {
  tr: [
    {
      id: 'gurgentepe-golkoy-lidar',
      title: 'Gürgentepe – Gölköy LiDAR Haritalama ve Hâlihazır Harita Çalışması',
      city: 'Ordu',
      type: 'LİDAR Drone İle Haritalama',
      services: ['Drone ile Haritalandırma', 'Fotogrametri', 'Mühendislik Ölçümleri'],
      description:
        'Gürgentepe–Gölköy güzergâhında yaklaşık 13 km uzunluğundaki yol koridorunun, LiDAR teknolojisine sahip İHA sistemleri kullanılarak yüksek hassasiyetle haritalaması gerçekleştirilmiştir. Elde edilen yoğun nokta bulutu verileri işlenerek güzergâha ait hâlihazır harita, sayısal arazi modeli ve mühendislik çalışmalarına uygun güncel jeodezik altlıklar oluşturulmuştur.',
      media: [{ type: 'image', src: '/web/proje_01.webp' }],
    },
    {
      id: 'aydin-parki-yersel-lidar',
      title: 'Aydın Parkı Yersel LiDAR Tarama ve Hâlihazır Harita Çalışması',
      city: 'Aydın',
      type: 'Yersel LiDAR ile Tarama ve Haritalama',
      services: ['Yersel LiDAR ile Haritalandırma', 'Hâlihazır Harita Üretimi', 'Mühendislik Ölçümleri'],
      description:
        "Aydın Parkı'nın mevcut durumunun yüksek hassasiyetle belirlenmesi amacıyla yersel LiDAR teknolojisi kullanılarak detaylı tarama çalışması gerçekleştirilmiştir. Elde edilen yoğun nokta bulutu verileri işlenerek park alanına ait hâlihazır harita ve mühendislik çalışmalarında kullanılabilecek güncel sayısal altlıklar oluşturulmuştur.",
      media: [
        { type: 'image', src: '/web/proje_02_01(2).webp' },
        { type: 'image', src: '/web/proje_02_02.webp' },
      ],
    },
    {
      id: 'bingol-kati-atik-fotogrametri',
      title: 'Katı Atık Sahası Fotogrametrik Haritalama Çalışması',
      city: '',
      type: 'Fotogrametri ile Haritalama',
      services: ['Drone ile Haritalandırma', 'Fotogrametri', 'Mühendislik Ölçümleri'],
      description:
        "Katı atık sahasının mevcut durumunun yüksek hassasiyetle belirlenmesi amacıyla İHA tabanlı fotogrametri yöntemi kullanılarak detaylı haritalama çalışması gerçekleştirilmiştir. Elde edilen yüksek çözünürlüklü görüntüler işlenerek saha için ortofoto, sayısal yüzey modeli ve mühendislik çalışmalarında kullanılabilecek güncel sayısal harita altlıkları oluşturulmuştur.",
      media: [
        { type: 'video', src: '/web/proje_03_01.mp4' },
        { type: 'image', src: '/web/proje_03_02.webp' },
      ],
    },
    {
      id: 'aydin-uzun-carsi-lidar-roleve',
      title: 'Aydın Uzun Çarşı Yersel LiDAR Haritalama ve Röleve Çalışması',
      city: 'Aydın',
      type: 'Yersel LiDAR ile Haritalama ve Röleve',
      services: ['Yersel LiDAR ile Haritalandırma', 'Röleve Çalışması', 'Mühendislik Ölçümleri'],
      description:
        "Aydın Uzun Çarşı'nın mevcut fiziksel durumunun yüksek hassasiyetle belgelenmesi amacıyla yersel LiDAR teknolojisi kullanılarak detaylı tarama ve ölçüm çalışması gerçekleştirilmiştir. Elde edilen yoğun nokta bulutu verileri işlenerek çarşının mevcut durumunu yansıtan sayısal veriler, röleve çıktıları ve mühendislik çalışmalarında kullanılabilecek güvenilir ölçüm altlıkları oluşturulmuştur.",
      media: [
        { type: 'image', src: '/web/proje_04_01.webp' },
        { type: 'image', src: '/web/proje_04_02.webp' },
      ],
    },
    {
      id: 'amasra-fotogrametrik-harita',
      title: 'Amasra Fotogrametrik Harita Yapımı',
      city: 'Bartın',
      type: 'Fotogrametri ile Haritalama',
      services: ['Drone ile Haritalandırma', 'Fotogrametri', 'Hâlihazır Harita Üretimi'],
      description:
        "Amasra kent merkezi ve sahil bandının mevcut durumunun yüksek hassasiyetle belirlenmesi amacıyla İHA tabanlı fotogrametri yöntemi kullanılarak detaylı haritalama çalışması gerçekleştirilmiştir. Elde edilen yüksek çözünürlüklü görüntüler işlenerek yaklaşık 385 x 616 metrelik çalışma alanına ait yoğun nokta bulutu, ortofoto, sayısal yüzey modeli ve mühendislik çalışmalarında kullanılabilecek güncel hâlihazır harita altlıkları üretilmiştir.",
      media: [
        { type: 'image', src: '/web/proje_05_01.webp' },
        { type: 'image', src: '/web/proje_05_02.webp' },
      ],
      pointCloud: '/pointclouds/amasra.ply',
    },
  ],
  en: [
    {
      id: 'gurgentepe-golkoy-lidar',
      title: 'Gürgentepe–Gölköy LiDAR Mapping and Base Map Survey',
      city: 'Ordu',
      type: 'LiDAR Mapping with Drone',
      services: ['Drone Mapping', 'Photogrammetry', 'Engineering Surveys'],
      description:
        'The approximately 13 km road corridor on the Gürgentepe–Gölköy route was mapped with high precision using UAV systems equipped with LiDAR technology. The dense point cloud data obtained was processed to produce a base map, digital terrain model, and up-to-date geodetic bases suitable for engineering studies along the route.',
      media: [{ type: 'image', src: '/web/proje_01.webp' }],
    },
    {
      id: 'aydin-parki-yersel-lidar',
      title: 'Aydın Park Terrestrial LiDAR Scanning and Base Map Survey',
      city: 'Aydın',
      type: 'Scanning and Mapping with Terrestrial LiDAR',
      services: ['Terrestrial LiDAR Mapping', 'Base Map Production', 'Engineering Surveys'],
      description:
        'A detailed scanning study was carried out using terrestrial LiDAR technology to determine the current condition of Aydın Park with high precision. The dense point cloud data obtained was processed to produce a base map of the park area and up-to-date digital bases usable in engineering studies.',
      media: [
        { type: 'image', src: '/web/proje_02_01(2).webp' },
        { type: 'image', src: '/web/proje_02_02.webp' },
      ],
    },
    {
      id: 'bingol-kati-atik-fotogrametri',
      title: 'Solid Waste Site Photogrammetric Mapping Survey',
      city: '',
      type: 'Mapping with Photogrammetry',
      services: ['Drone Mapping', 'Photogrammetry', 'Engineering Surveys'],
      description:
        'A detailed mapping study was carried out using UAV-based photogrammetry to determine the current condition of the solid waste site with high precision. The high-resolution imagery obtained was processed to produce an orthophoto, digital surface model, and up-to-date digital map bases usable in engineering studies for the site.',
      media: [
        { type: 'video', src: '/web/proje_03_01.mp4' },
        { type: 'image', src: '/web/proje_03_02.webp' },
      ],
    },
    {
      id: 'aydin-uzun-carsi-lidar-roleve',
      title: 'Aydın Uzun Çarşı Terrestrial LiDAR Mapping and As-Built Survey',
      city: 'Aydın',
      type: 'Mapping and As-Built Survey with Terrestrial LiDAR',
      services: ['Terrestrial LiDAR Mapping', 'As-Built Survey', 'Engineering Surveys'],
      description:
        'A detailed scanning and measurement study was carried out using terrestrial LiDAR technology to document the current physical condition of Aydın Uzun Çarşı with high precision. The dense point cloud data obtained was processed to produce digital data reflecting the current state of the market, as-built outputs, and reliable measurement bases usable in engineering studies.',
      media: [
        { type: 'image', src: '/web/proje_04_01.webp' },
        { type: 'image', src: '/web/proje_04_02.webp' },
      ],
    },
    {
      id: 'amasra-fotogrametrik-harita',
      title: 'Amasra Photogrammetric Mapping Survey',
      city: 'Bartın',
      type: 'Mapping with Photogrammetry',
      services: ['Drone Mapping', 'Photogrammetry', 'Base Map Production'],
      description:
        'A detailed mapping study was carried out using UAV-based photogrammetry to determine the current condition of the Amasra town centre and shoreline with high precision. The high-resolution imagery obtained was processed to produce a dense point cloud, orthophoto, digital surface model, and up-to-date base map data for the roughly 385 x 616 metre survey area, suitable for engineering studies.',
      media: [
        { type: 'image', src: '/web/proje_05_01.webp' },
        { type: 'image', src: '/web/proje_05_02.webp' },
      ],
      pointCloud: '/pointclouds/amasra.ply',
    },
  ],
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}

/** Decorative topographic lines behind the section. Purely ornamental. */
function ContourBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--color-primary-300)" strokeWidth="1" opacity="0.22">
          <path d="M -40 168 C 240 96, 520 232, 780 160 S 1240 60, 1500 148" />
          <path d="M -40 286 C 260 214, 540 350, 800 278 S 1260 178, 1500 266" />
          <path d="M -40 566 C 260 494, 540 630, 800 558 S 1260 458, 1500 546" />
          <path d="M -40 700 C 240 628, 520 764, 780 692 S 1240 592, 1500 680" />
        </g>
        <g stroke="var(--color-primary-400)" strokeWidth="1" opacity="0.18">
          <path d="M 150 60 L 150 78 M 141 69 L 159 69" />
          <path d="M 1290 214 L 1290 232 M 1281 223 L 1299 223" />
          <path d="M 96 640 L 96 658 M 87 649 L 105 649" />
          <path d="M 1348 726 L 1348 744 M 1339 735 L 1357 735" />
        </g>
      </svg>
    </div>
  )
}

/**
 * Small semi-transparent prev/next control reused by both the inline media
 * stage (detail modal only) and the fullscreen lightbox, so the two share one
 * visual language instead of two hand-rolled buttons.
 */
function MediaNavButton({
  direction,
  onClick,
  t,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  t: Translations['projects']
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={direction === 'prev' ? t.prevImage : t.nextImage}
      className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/45 text-white transition-colors duration-200 hover:bg-white/60 sm:h-9 sm:w-9 ${
        direction === 'prev' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
        {direction === 'prev' ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

/**
 * The project's photo/video stack. Existing single-image stage, extended to
 * step through every file that belongs to a project (some have more than one
 * photo, one has a video) via the same crossfade already used when switching
 * between projects. Dots reuse the exact bullet styling already defined below
 * for the "Hizmetler" list, rather than introducing a new visual element.
 *
 * `enableControls` is only turned on from the detail modal — the main project
 * list's hover preview keeps using this same component with it left off, so
 * its look/behavior is unchanged.
 */
function ProjectMediaStage({
  media,
  activeIndex,
  onSelect,
  alt,
  prefersReducedMotion,
  chip,
  enableControls = false,
  onPrev,
  onNext,
  onImageClick,
  t,
}: {
  media: Media[]
  activeIndex: number
  onSelect: (index: number) => void
  alt: string
  prefersReducedMotion: boolean | null
  chip?: ReactNode
  enableControls?: boolean
  onPrev?: () => void
  onNext?: () => void
  /** Video passes its current playback position so the lightbox can resume there instead of restarting at 0. */
  onImageClick?: (videoTime?: number) => void
  t: Translations['projects']
}) {
  const active = media[activeIndex]
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <>
      <AnimatePresence initial={false}>
        {active.type === 'video' ? (
          <motion.video
            key={`${alt}-${activeIndex}`}
            ref={videoRef}
            src={encodeURI(active.src)}
            autoPlay
            loop
            muted
            playsInline
            onClick={enableControls && onImageClick ? () => onImageClick(videoRef.current?.currentTime) : undefined}
            className={`absolute inset-0 h-full w-full object-cover ${
              enableControls && onImageClick ? 'cursor-pointer' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
          />
        ) : (
          <motion.img
            key={`${alt}-${activeIndex}`}
            src={encodeURI(active.src)}
            alt={alt}
            onClick={enableControls && onImageClick ? () => onImageClick() : undefined}
            className={`absolute inset-0 h-full w-full object-cover ${
              enableControls && onImageClick ? 'cursor-pointer' : ''
            }`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {active.type === 'image' && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.34)_0%,rgba(15,23,42,0)_38%)]" />
      )}

      {chip}

      {enableControls && media.length > 1 && onPrev && onNext && (
        <>
          <MediaNavButton direction="prev" onClick={onPrev} t={t} />
          <MediaNavButton direction="next" onClick={onNext} t={t} />
        </>
      )}

      {media.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {media.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={t.showImage(index + 1)}
              aria-current={index === activeIndex}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ease-out ${
                index === activeIndex ? 'bg-[var(--color-primary-500)]' : 'bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

function ProjectDetail({
  project,
  index,
  onClose,
  t,
}: {
  project: Project
  index: number
  onClose: () => void
  t: Translations['projects']
}) {
  const prefersReducedMotion = useReducedMotion()
  const [mediaIndex, setMediaIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isCloudOpen, setIsCloudOpen] = useState(false)
  // Captured from the inline video at the moment it's clicked, so the lightbox
  // copy can seek to the same spot instead of restarting at 0.
  const lightboxStartTimeRef = useRef(0)

  const goToPrev = () => setMediaIndex((current) => (current - 1 + project.media.length) % project.media.length)
  const goToNext = () => setMediaIndex((current) => (current + 1) % project.media.length)

  // Escape closes whichever layer is on top: the lightbox first if it's open,
  // otherwise the detail panel itself.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      // The point cloud viewer sits above everything and closes itself on
      // Escape, so leave that key alone while it is open.
      if (isCloudOpen) return

      if (isLightboxOpen) {
        setIsLightboxOpen(false)
      } else {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isLightboxOpen, isCloudOpen])

  // Lock the page behind the panel, compensating for the scrollbar so the site
  // underneath does not shift while it is open.
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
    }
  }, [])

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

  const activeMedia = project.media[mediaIndex]

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          className="absolute inset-0 bg-[rgba(255,255,255,0.55)] backdrop-blur-[8px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: 'easeOut' }}
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.projectDetailAria(project.title)}
          className="relative flex h-[90vh] max-h-[820px] w-full max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.16)] lg:w-[86vw] lg:flex-row"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={transition}
        >
          <div className="relative h-[38%] w-full shrink-0 overflow-hidden lg:h-full lg:w-[54%]">
            <ProjectMediaStage
              media={project.media}
              activeIndex={mediaIndex}
              onSelect={setMediaIndex}
              alt={project.city ? `${project.title} - ${project.city}` : project.title}
              prefersReducedMotion={prefersReducedMotion}
              enableControls
              onPrev={goToPrev}
              onNext={goToNext}
              onImageClick={(videoTime) => {
                lightboxStartTimeRef.current = videoTime ?? 0
                setIsLightboxOpen(true)
              }}
              t={t}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
            {/* min-h-full + flex-col so the type/location/services block below
                can be pushed to mt-auto: it anchors to the card's bottom edge
                on short descriptions instead of trailing right under the text,
                while still flowing (and scrolling) naturally when content is
                long enough to fill the card on its own. */}
            <div className="flex min-h-full flex-col">
              <div>
                <span className="text-sm font-semibold tracking-[0.12em] text-[var(--color-primary-600)]">
                  {t.projectLabel} {formatIndex(index)}
                </span>

                <h2 className="mt-2 text-xl text-[var(--color-heading)] sm:text-2xl">{project.title}</h2>

                {project.city && (
                  <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[var(--color-primary-600)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {project.city}
                  </p>
                )}

                <p className="mt-6 text-[var(--color-body)]">{project.description}</p>

                {project.pointCloud && (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => setIsCloudOpen(true)}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--color-primary-500)] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-[var(--color-primary-600)]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4.5 w-4.5" aria-hidden="true">
                        <path d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4l9-4.8Z" strokeLinejoin="round" />
                        <path d="m3 7.4 9 4.8 9-4.8M12 12.2v9.2" strokeLinejoin="round" />
                      </svg>
                      {t.viewPointCloud}
                    </button>
                    <p className="mt-2 text-center text-xs text-[var(--color-muted)]">{t.pointCloudHint}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6">
                <dl className="space-y-2.5 border-t border-[var(--color-border)] pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--color-muted)]">{t.projectType}</dt>
                    <dd className="text-right font-semibold text-[var(--color-heading)]">{project.type}</dd>
                  </div>
                  {project.city && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--color-muted)]">{t.location}</dt>
                      <dd className="text-right font-semibold text-[var(--color-heading)]">{project.city}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5">
                  <h3 className="text-base text-[var(--color-heading)]">{t.servicesLabel}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
                    {project.services.map((service) => (
                      <li key={service} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)]" aria-hidden="true" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeProject}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-xl text-[var(--color-heading)] backdrop-blur-sm transition-colors duration-300 hover:text-[var(--color-primary-600)]"
          >
            ×
          </button>
        </motion.div>
      </div>

      {project.pointCloud && (
        <PointCloudLightbox
          open={isCloudOpen}
          src={project.pointCloud}
          title={project.title}
          onClose={() => setIsCloudOpen(false)}
        />
      )}

      {/* Lightbox: a separate, higher-stacked overlay so clicking a photo can
          show it at full size without closing the detail panel underneath. */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="relative flex max-h-full max-w-full items-center justify-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              {activeMedia.type === 'video' ? (
                <video
                  key={activeMedia.src}
                  src={encodeURI(activeMedia.src)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedMetadata={(event) => {
                    event.currentTarget.currentTime = lightboxStartTimeRef.current
                  }}
                  className="max-h-[90vh] max-w-[95vw] object-contain"
                />
              ) : (
                <img
                  src={encodeURI(activeMedia.src)}
                  alt={project.city ? `${project.title} - ${project.city}` : project.title}
                  className="max-h-[90vh] max-w-[95vw] object-contain"
                />
              )}

              {project.media.length > 1 && (
                <>
                  <MediaNavButton direction="prev" onClick={goToPrev} t={t} />
                  <MediaNavButton direction="next" onClick={goToNext} t={t} />
                </>
              )}
            </motion.div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label={t.closeFullscreen}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/45 text-white transition-colors duration-200 hover:bg-white/60 sm:right-6 sm:top-6 sm:h-9 sm:w-9"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Projects() {
  const { language } = useLanguage()
  const t = translations[language]
  const projects = projectsByLanguage[language]
  const [activeId, setActiveId] = useState(projects[0].id)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const activeIndex = Math.max(
    projects.findIndex((project) => project.id === activeId),
    0,
  )
  const activeProject = projects[activeIndex]
  const openIndex = projects.findIndex((project) => project.id === openId)
  const openProject = openIndex >= 0 ? projects[openIndex] : null

  const selectProject = (id: string) => {
    setActiveId(id)
    setActiveMediaIndex(0)
  }

  return (
    <section
      id="projects"
      className="relative flex min-h-[calc(100svh-88px)] flex-col justify-center overflow-hidden bg-[#F7FAFD] py-20 sm:py-24"
      aria-labelledby="projects-heading"
    >
      <ContourBackdrop />

      {/* Feathers the section's light-blue tint into the white neighbours above/below,
          so the seam reads as a soft blend instead of a hard color edge. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,#ffffff,transparent)] sm:h-32"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#ffffff,transparent)] sm:h-32"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span data-nav-label className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">
            {t.projects.eyebrow}
          </span>
          <h2 id="projects-heading" className="mt-4 text-[var(--color-heading)]">
            {t.projects.headingLine1}
            <br />
            {t.projects.headingLine2}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-[1.36fr_1fr] lg:gap-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {/* A fixed aspect ratio keeps the stage from collapsing on mobile, where
              it sits in its own grid row above the list. From lg up the two
              columns share one row, so the stage instead stretches (grid's
              default align-items) to match the list's full height. */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.10)] lg:aspect-auto">
            <ProjectMediaStage
              media={activeProject.media}
              activeIndex={activeMediaIndex}
              onSelect={setActiveMediaIndex}
              alt={activeProject.city ? `${activeProject.title} - ${activeProject.city}` : activeProject.title}
              prefersReducedMotion={prefersReducedMotion}
              chip={
                <div className="pointer-events-none absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/90">
                  <div>{t.projects.projectLabel} {formatIndex(activeIndex)}</div>
                  {activeProject.city && <div className="mt-1 text-white/70">{activeProject.city}</div>}
                </div>
              }
              t={t.projects}
            />
          </div>

          {/* min-w-0: without it, the long non-wrapping project titles inside
              (truncated only visually via CSS) push this grid track to their
              full text width instead of the container's width — on mobile,
              where there's no explicit grid-template-columns yet, that
              silently over-widened the stage above it too. */}
          <ul className="flex min-w-0 flex-col">
            {projects.map((project, index) => {
              const isActive = project.id === activeProject.id

              return (
                <li key={project.id} className="border-b border-[var(--color-border)] last:border-b-0">
                  <button
                    type="button"
                    onMouseEnter={() => selectProject(project.id)}
                    onFocus={() => selectProject(project.id)}
                    onClick={() => {
                      selectProject(project.id)
                      setOpenId(project.id)
                    }}
                    aria-label={t.projects.openProjectAria(project.title)}
                    className={`group relative flex w-full items-center gap-4 rounded-lg px-4 py-5 text-left transition-colors duration-300 ease-out sm:gap-6 ${
                      isActive ? 'bg-[var(--color-primary-50)]' : 'hover:bg-[var(--color-primary-50)]'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
                        isActive ? 'bg-[var(--color-primary-500)] opacity-100' : 'bg-[var(--color-primary-300)] opacity-0 group-hover:opacity-100'
                      }`}
                      aria-hidden="true"
                    />

                    <span
                      className={`font-mono text-lg font-semibold tabular-nums transition-colors duration-300 ease-out ${
                        isActive ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-muted)] group-hover:text-[var(--color-primary-600)]'
                      }`}
                    >
                      {formatIndex(index)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-lg font-semibold transition-colors duration-300 ease-out ${
                          isActive ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-heading)]'
                        }`}
                      >
                        {project.title}
                      </span>
                      {project.city && (
                        <span className="mt-0.5 block text-sm text-[var(--color-body)]">{project.city}</span>
                      )}
                    </span>

                    <span
                      className={`shrink-0 transition-all duration-300 ease-out ${
                        isActive
                          ? 'translate-x-0 text-[var(--color-primary-600)]'
                          : 'text-[var(--color-muted)] group-hover:translate-x-1 group-hover:text-[var(--color-primary-600)]'
                      }`}
                      aria-hidden="true"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectDetail
            key={openProject.id}
            project={openProject}
            index={openIndex}
            onClose={() => setOpenId(null)}
            t={t.projects}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
