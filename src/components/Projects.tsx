import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Project = {
  id: string
  title: string
  city: string
  description: string
  image: string
}

const projects: Project[] = [
  {
    id: 'drone-haritalama',
    title: 'Drone Haritalama',
    city: 'Ankara',
    description: 'Geniş ölçekli arazi verilerini hızlı, güvenilir ve yüksek doğrulukla dijital ortama aktardığımız örnek çalışma.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'arazi-modelleme',
    title: 'Arazi Modelleme',
    city: 'İstanbul',
    description: 'Saha verilerini karar süreçlerini destekleyen hassas topoğrafik modellere dönüştürdüğümüz kapsamlı proje.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'santiye-olcumleri',
    title: 'Şantiye Ölçümleri',
    city: 'İzmir',
    description: 'Yapım sürecinin her aşamasında aplikasyon ve kontrol ölçümleriyle güvenilir ilerleme sağladığımız proje.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'altyapi-haritalama',
    title: 'Altyapı Haritalama',
    city: 'Bursa',
    description: 'Kentsel altyapı ağlarını güncel, erişilebilir ve sürdürülebilir coğrafi veriyle buluşturduğumuz çalışma.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'kentsel-donusum',
    title: 'Kentsel Dönüşüm',
    city: 'Konya',
    description: 'Kentsel alanlar için ölçüm, analiz ve güncel coğrafi veri ürettiğimiz çok disiplinli mühendislik projesi.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=85',
  },
]

const projectServices = ['Drone Survey', 'Photogrammetry', 'Engineering Measurements']

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

function ProjectDetail({
  project,
  index,
  onClose,
}: {
  project: Project
  index: number
  onClose: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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

  return (
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
        aria-label={`${project.title} proje detayı`}
        className="relative flex h-[72vh] max-h-[760px] w-full max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.16)] lg:w-[86vw] lg:flex-row"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={transition}
      >
        <div className="relative h-[38%] w-full shrink-0 overflow-hidden lg:h-full lg:w-[54%]">
          <img
            src={project.image}
            alt={`${project.title} - ${project.city}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-10 sm:py-10">
          <span className="text-sm font-semibold tracking-[0.12em] text-[var(--color-primary-600)]">
            PROJE {formatIndex(index)}
          </span>

          <h2 className="mt-3 text-[var(--color-heading)]">{project.title}</h2>

          <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[var(--color-primary-600)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {project.city}
          </p>

          <p className="body-large mt-5 text-[var(--color-body)]">{project.description}</p>

          <dl className="mt-8 space-y-3 border-t border-[var(--color-border)] pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Proje Türü</dt>
              <dd className="text-right font-semibold text-[var(--color-heading)]">{project.title}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted)]">Konum</dt>
              <dd className="text-right font-semibold text-[var(--color-heading)]">{project.city}</dd>
            </div>
          </dl>

          <div className="mt-7">
            <h3 className="text-base text-[var(--color-heading)]">Hizmetler</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
              {projectServices.map((service) => (
                <li key={service} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)]" aria-hidden="true" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Projeyi kapat"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-xl text-[var(--color-heading)] backdrop-blur-sm transition-colors duration-300 hover:text-[var(--color-primary-600)]"
        >
          ×
        </button>
      </motion.div>
    </div>
  )
}

export function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const [openId, setOpenId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const activeIndex = Math.max(
    projects.findIndex((project) => project.id === activeId),
    0,
  )
  const activeProject = projects[activeIndex]
  const openIndex = projects.findIndex((project) => project.id === openId)
  const openProject = openIndex >= 0 ? projects[openIndex] : null

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
          className="grid gap-6 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div>
            <span data-nav-label className="text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)]">
              PROJELERİMİZ
            </span>
            <h2 id="projects-heading" className="mt-4 text-[var(--color-heading)]">
              Tamamladığımız
              <br />
              Bazı Çalışmalar
            </h2>
          </div>

          <p className="body-large text-[var(--color-body)]">
            Farklı proje ölçeklerinde hassas veri, güçlü teknoloji ve deneyimli saha ekiplerini bir araya
            getiriyoruz.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-[1.36fr_1fr] lg:gap-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Stage keeps a fixed aspect ratio so swapping the image never shifts layout. */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
            <AnimatePresence initial={false}>
              <motion.img
                key={activeProject.id}
                src={activeProject.image}
                alt={`${activeProject.title} - ${activeProject.city}`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.34)_0%,rgba(15,23,42,0)_38%)]" />

            <div className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/90">
              <div>PROJE {formatIndex(activeIndex)}</div>
              <div className="mt-1 text-white/70">{activeProject.city}</div>
            </div>
          </div>

          <ul className="flex flex-col">
            {projects.map((project, index) => {
              const isActive = project.id === activeProject.id

              return (
                <li key={project.id} className="border-b border-[var(--color-border)] last:border-b-0">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveId(project.id)}
                    onFocus={() => setActiveId(project.id)}
                    onClick={() => {
                      setActiveId(project.id)
                      setOpenId(project.id)
                    }}
                    aria-label={`${project.title} projesini aç`}
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
                        className={`block truncate text-lg font-semibold transition-colors duration-300 ease-out ${
                          isActive ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-heading)]'
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-[var(--color-body)]">{project.city}</span>
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
          />
        )}
      </AnimatePresence>
    </section>
  )
}
