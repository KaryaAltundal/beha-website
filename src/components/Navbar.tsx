import { useEffect, useState } from 'react'
import logoUrl from '../../beha yeni logo/beha-logo-primary.svg'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'
import { LanguageSwitcher } from './LanguageSwitcher'

type NavItem = {
  label: string
  href: string
}

type NavbarProps = {
  items?: NavItem[]
}

export function Navbar({
  items,
}: NavbarProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const defaultItems: NavItem[] = [
    { label: t.navbar.home, href: '#home' },
    { label: t.navbar.about, href: '#about' },
    { label: t.navbar.services, href: '#services' },
    { label: t.navbar.projects, href: '#projects' },
    { label: t.navbar.references, href: '#references' },
    { label: t.navbar.contact, href: '#contact' },
  ]
  const navItems = items ?? defaultItems
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(navItems[0]?.href ?? '#home')

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

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    const section =
      href === '#home'
        ? document.querySelector<HTMLElement>('[aria-label="Hero section"]')
        : document.querySelector<HTMLElement>(href)
    const isMobileNavigation = window.matchMedia('(max-width: 1023px)').matches
    // Align to the section itself, not to a label inside it. Targeting the inner
    // label scrolled the section's top padding off-screen, which left the section
    // shorter than the viewport and let the following section's background show
    // along the bottom edge.
    const scrollTarget = section

    if (scrollTarget) {
      // The target's pixel offset is computed once, right now. If the cursor
      // (which stays put on screen while the page scrolls under it) ends up
      // over something that reacts to hover — e.g. a Services card that
      // expands on hover-start — that reaction changes page height mid-scroll
      // and the scroll undershoots into whatever section grew, instead of
      // reaching the clicked one. Locking pointer events for the scroll's
      // duration stops anything from reacting to the stationary cursor.
      document.body.style.pointerEvents = 'none'
      // Belt and suspenders: 'scrollend' is the precise signal, but a scroll
      // that gets interrupted or never properly starts (backgrounded tab,
      // reduced motion, etc.) would otherwise leave the whole page inert
      // forever. The timeout guarantees the lock always lifts.
      let unlocked = false
      const unlockPointerEvents = () => {
        if (unlocked) return
        unlocked = true
        document.body.style.pointerEvents = ''
      }
      window.addEventListener('scrollend', unlockPointerEvents, { once: true })
      window.setTimeout(unlockPointerEvents, 1000)

      if (isMobileNavigation) {
        const mobileNavbarOffset = 72
        const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: Math.max(0, targetTop - mobileNavbarOffset), behavior: 'smooth' })
        return
      }

      const navbarHeight = event.currentTarget.closest('header')?.offsetHeight ?? 88
      const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(0, targetTop - navbarHeight), behavior: 'smooth' })
    }
  }

  const headerClasses = isScrolled
    ? 'h-[68px] bg-white/85 backdrop-blur-xl border-b border-[var(--color-border)] shadow-soft lg:h-[72px]'
    : 'h-[80px] bg-transparent lg:h-[88px]'

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Primary"
        className={`transition-[height,background-color,box-shadow,border-color] duration-300 ease-standard ${headerClasses}`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            onClick={(event) => scrollToSection(event, '#home')}
            className="flex items-center gap-3 text-[var(--color-heading)]"
            aria-label="BEHA home"
          >
            <img src={logoUrl} alt="BEHA logo" className="h-10 w-auto" />
          </a>

          <div className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = activeItem === item.href

                return (
                  <li key={item.href} className="relative">
                    <a
                      href={item.href}
                      onClick={(event) => {
                        setActiveItem(item.href)
                        scrollToSection(event, item.href)
                      }}
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

          <div className="flex shrink-0 items-center gap-4">
            <LanguageSwitcher />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-heading)] transition-colors duration-200 ease-standard hover:border-[var(--color-primary-300)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] lg:hidden"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <path d="M6 6 18 18" />
                    <path d="M18 6 6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
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
          {navItems.map((item, index) => {
            const isActive = activeItem === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  setActiveItem(item.href)
                  setMobileOpen(false)
                  scrollToSection(event, item.href)
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
