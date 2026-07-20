import { useEffect, useState } from 'react'
import logoUrl from '../../beha yeni logo/beha-logo-primary.svg'

type NavItem = {
  label: string
  href: string
}

type NavbarProps = {
  items?: NavItem[]
}

const defaultItems: NavItem[] = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Hakkımızda', href: '#about' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Projeler', href: '#projects' },
  { label: 'Referanslar', href: '#references' },
  { label: 'İletişim', href: '#contact' },
]

export function Navbar({
  items = defaultItems,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(items[0]?.href ?? '#home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const headerClasses = isScrolled
    ? 'h-[72px] bg-white/85 backdrop-blur-xl border-b border-[var(--color-border)] shadow-soft'
    : 'h-[88px] bg-transparent'

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className={`transition-[height,background-color,box-shadow,border-color] duration-300 ease-standard ${headerClasses}`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            className="flex items-center gap-3 text-[var(--color-heading)] transition-opacity duration-200 ease-standard hover:opacity-80"
            aria-label="BEHA home"
          >
            <img src={logoUrl} alt="BEHA logo" className="h-10 w-auto" />
          </a>

          <div className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-8">
              {items.map((item) => {
                const isActive = activeItem === item.href

                return (
                  <li key={item.href} className="relative">
                    <a
                      href={item.href}
                      onClick={() => setActiveItem(item.href)}
                      className="group relative inline-flex items-center py-2 text-sm font-semibold tracking-[0.02em] text-[var(--color-body)] transition-colors duration-200 ease-standard hover:text-[var(--color-primary-600)]"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[var(--color-primary-500)] transition-all duration-200 ease-standard ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-heading)] transition-colors duration-200 ease-standard hover:border-[var(--color-primary-300)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-standard ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ease-standard ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-standard ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 bg-[var(--color-background)]/95 transition-opacity duration-300 ease-standard lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="container flex min-h-screen flex-col justify-center gap-4 pt-24">
          {items.map((item, index) => {
            const isActive = activeItem === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.href)
                  setMobileOpen(false)
                }}
                className={`translate-y-3 text-3xl font-semibold text-[var(--color-heading)] transition-all duration-300 ease-emphasized ${
                  mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span
                  className={`inline-flex border-b pb-3 ${
                    isActive
                      ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {item.label}
                </span>
              </a>
            )
          })}

        </div>
      </div>
    </header>
  )
}
