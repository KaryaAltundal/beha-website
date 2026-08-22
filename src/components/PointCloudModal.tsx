import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

/**
 * Lightbox shell for the 3D point cloud.
 *
 * Everything that touches three lives in PointCloudViewer, behind this lazy
 * boundary, so the library is fetched the first time someone opens a cloud and
 * never on the initial page load. This file deliberately imports nothing heavy
 * — it only draws the backdrop and the fallback that shows while that chunk is
 * in flight.
 */
const PointCloudViewer = lazy(() => import('./PointCloudViewer'))

export function PointCloudModal({
  src,
  title,
  onClose,
}: {
  src: string
  title: string
  onClose: () => void
}) {
  const { language } = useLanguage()
  const t = translations[language].pointCloud
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Same scroll lock the project detail panel uses, so opening the viewer from
  // inside that panel does not let the page behind it shift.
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

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t.dialogAria(title)}
        className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0d1218] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span
                className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-[var(--color-primary-500)]"
                aria-hidden="true"
              />
              <p className="text-sm text-white/60">{t.preparing}</p>
            </div>
          }
        >
          <PointCloudViewer src={src} title={title} onClose={onClose} t={t} />
        </Suspense>
      </motion.div>
    </motion.div>
  )
}

/** Wraps the modal in the exit animation, so callers just toggle `open`. */
export function PointCloudLightbox({
  open,
  src,
  title,
  onClose,
}: {
  open: boolean
  src: string
  title: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && <PointCloudModal src={src} title={title} onClose={onClose} />}
    </AnimatePresence>
  )
}
