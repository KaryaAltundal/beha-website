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
    // Two separate thresholds on purpose. The bar shrinks by 16px when it turns
    // opaque, and Chrome's scroll anchoring compensates for that by moving the
    // scroll offset the same 16px — so a single threshold could be crossed by
    // its own effect, which is what made the bar flash on and off a few pixels
    // below the top of the page. The header reserves a constant height now, so
    // there is nothing left for anchoring to react to, but the gap between the
    // two thresholds is wider than the shrink either way.
    const handleScroll = () => {
      setIsScrolled((wasScrolled) => (wasScrolled ? window.scrollY > 8 : window.scrollY > 48))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

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
        const mobileNavbarOffset = document.querySelector('nav')?.offsetHeight ?? 72
        // Sections carry their own generous top padding (py-24 and similar) for
        // when someone scrolls to them organically. Landing exactly on the
        // section's border box after a nav click left that whole padding as
        // dead space under the bar, pushing the heading much further down than
        // a tap should. Skipping past most of it — but not all, so there is
        // still a clean gap — puts the heading right under the bar instead.
        const paddingTop = parseFloat(getComputedStyle(scrollTarget).paddingTop) || 0
        const mobileRestGap = 24
        const targetTop =
          scrollTarget.getBoundingClientRect().top + window.scrollY + Math.max(0, paddingTop - mobileRestGap)
        window.scrollTo({ top: Math.max(0, targetTop - mobileNavbarOffset), behavior: 'smooth' })
        return
      }

      const navbarHeight = event.currentTarget.closest('nav')?.offsetHeight ?? 88
      const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(0, targetTop - navbarHeight), behavior: 'smooth' })
    }
  }

  const headerClasses = isScrolled
    ? 'h-[4.25rem] bg-white/85 backdrop-blur-xl border-b border-[var(--color-border)] shadow-soft lg:h-[4.5rem]'
    : 'h-[5rem] bg-transparent lg:h-[5.5rem]'

  return (
    // The header reserves one height for the whole page and the bar inside it
    // shrinks on its own. The bar used to shrink in flow, which pulled every
    // section below it up by 16px whenever the state flipped — a jump the
    // browser absorbed by nudging the scroll offset the same 16px, which
    // flipped the state straight back. Out of flow, there is nothing to absorb.
    // The header box is therefore taller than the shrunken bar, so it is left
    // transparent to the cursor and the bar takes those clicks back.
    <header className="pointer-events-none sticky top-0 z-50 h-[5rem] lg:h-[5.5rem]">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto absolute inset-x-0 top-0 transition-[height,background-color,box-shadow,border-color] duration-300 ease-standard ${headerClasses}`}
      >
        <div className="mx-auto flex h-full w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
                        className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--color-primary-500)] transition-all duration-200 ease-standard ${
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
