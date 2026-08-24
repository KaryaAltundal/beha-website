import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

const centerLatitude = 39.92
const centerLongitude = 32.854

function toDms(decimal: number, isLatitude: boolean) {
  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutes = Math.floor((absolute - degrees) * 60)
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2)

  const direction = isLatitude ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W'

  return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.padStart(5, '0')}"${direction}`
}

export function Hero() {
  const { language } = useLanguage()
  const t = translations[language]
  const sectionRef = useRef<HTMLElement | null>(null)
  const mapRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const currentMapRef = useRef({ x: 0, y: 0 })
  const targetMapRef = useRef({ x: 0, y: 0 })
  const currentLatRef = useRef(centerLatitude)
  const currentLonRef = useRef(centerLongitude)
  const targetLatRef = useRef(centerLatitude)
  const targetLonRef = useRef(centerLongitude)
  const [latValue, setLatValue] = useState(centerLatitude)
  const [lonValue, setLonValue] = useState(centerLongitude)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const updateViewport = () => setIsMobile(mobileQuery.matches)

    updateViewport()
    mobileQuery.addEventListener('change', updateViewport)

    return () => mobileQuery.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    if (isMobile) {
      currentMapRef.current = { x: 0, y: 0 }
      targetMapRef.current = { x: 0, y: 0 }
      currentLatRef.current = centerLatitude
      currentLonRef.current = centerLongitude
      targetLatRef.current = centerLatitude
      targetLonRef.current = centerLongitude
      mapRef.current?.style.removeProperty('transform')
      setLatValue(centerLatitude)
      setLonValue(centerLongitude)
      return
    }

    const tick = () => {
      const nextMapX = currentMapRef.current.x + (targetMapRef.current.x - currentMapRef.current.x) * 0.08
      const nextMapY = currentMapRef.current.y + (targetMapRef.current.y - currentMapRef.current.y) * 0.08
      const nextLat = currentLatRef.current + (targetLatRef.current - currentLatRef.current) * 0.08
      const nextLon = currentLonRef.current + (targetLonRef.current - currentLonRef.current) * 0.08

      currentMapRef.current = { x: nextMapX, y: nextMapY }
      currentLatRef.current = nextLat
      currentLonRef.current = nextLon

      if (mapRef.current) {
        mapRef.current.style.transform = `translate3d(${nextMapX}px, ${nextMapY}px, 0)`
      }

      setLatValue(nextLat)
      setLonValue(nextLon)

      const needsAnotherFrame =
        Math.abs(targetMapRef.current.x - nextMapX) > 0.01 ||
        Math.abs(targetMapRef.current.y - nextMapY) > 0.01 ||
        Math.abs(targetLatRef.current - nextLat) > 0.00001 ||
        Math.abs(targetLonRef.current - nextLon) > 0.00001

      if (needsAnotherFrame) {
        frameRef.current = window.requestAnimationFrame(tick)
        return
      }

      frameRef.current = null
    }

    const handleMove = (event: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const relativeX = (event.clientX - rect.left) / rect.width - 0.5
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5

      targetMapRef.current = {
        x: Math.max(-12, Math.min(12, relativeX * 24)),
        y: Math.max(-8, Math.min(8, relativeY * 16)),
      }

      targetLatRef.current = Number((centerLatitude + relativeY * 0.005).toFixed(6))
      targetLonRef.current = Number((centerLongitude + relativeX * 0.006).toFixed(6))

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }

    const handleLeave = () => {
      targetMapRef.current = { x: 0, y: 0 }
      targetLatRef.current = centerLatitude
      targetLonRef.current = centerLongitude

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }

    const currentSection = sectionRef.current
    currentSection?.addEventListener('mousemove', handleMove)
    currentSection?.addEventListener('mouseleave', handleLeave)

    return () => {
      currentSection?.removeEventListener('mousemove', handleMove)
      currentSection?.removeEventListener('mouseleave', handleLeave)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-white lg:min-h-[calc(100svh-88px)]"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={mapRef}
          src="/hero-map.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: '0.45', filter: 'contrast(1.05)' }}
        />
      </div>

      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.45)_52%,rgba(255,255,255,0)_100%)]" />

      <div className="container relative z-20 flex h-full items-center py-5 pb-36 sm:py-8 sm:pb-32 lg:py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="max-w-[640px]">
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white/90 px-4 py-2 text-sm font-semibold tracking-[0.02em] text-[var(--color-primary-600)] backdrop-blur-sm">
              {t.hero.badge}
            </span>

            <h1 className="mt-5 max-w-[14ch] text-[var(--color-heading)] max-sm:[&_.display]:text-[2.5rem] sm:mt-6">
              <span className="display block">{t.hero.titleLine1}</span>
              <span className="display block">{t.hero.titleLine2}</span>
            </h1>

            <p className="mt-6 max-w-[60ch] body-large text-[var(--color-body)]">
              {t.hero.paragraph}
            </p>
          </div>

          <div />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-4 z-30 font-mono sm:right-6 lg:bottom-10 lg:right-10">
        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#6B7280] opacity-45">
          GNSS ONLINE
        </div>

        <div className="space-y-1 text-[12px]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] opacity-45">LAT</span>
            <span className="text-[14px] font-semibold text-[#4B83B4]">{toDms(latValue, true)}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] opacity-45">LON</span>
            <span className="text-[14px] font-semibold text-[#4B83B4]">{toDms(lonValue, false)}</span>
          </div>

          <div className="mt-2 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] opacity-45">RTK FIX</span>
            <span className="text-[14px] font-semibold text-[#4B83B4]">±2 cm</span>
          </div>
        </div>
      </div>
    </section>
  )
}
