import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import logoUrl from '../../beha yeni logo/beha-logo-primary.svg'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

function LocationIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 2 2.3Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.65 3H4.35A1.35 1.35 0 0 0 3 4.35v15.3A1.35 1.35 0 0 0 4.35 21h15.3A1.35 1.35 0 0 0 21 19.65V4.35A1.35 1.35 0 0 0 19.65 3ZM8.45 18.27H5.72V9.5h2.73v8.77ZM7.08 8.3a1.58 1.58 0 1 1 0-3.15 1.58 1.58 0 0 1 0 3.15Zm11.23 9.97h-2.72V14c0-1.02-.02-2.34-1.43-2.34-1.43 0-1.65 1.11-1.65 2.27v4.34H9.78V9.5H12.4v1.2h.04c.36-.69 1.25-1.42 2.57-1.42 2.75 0 3.26 1.81 3.26 4.17v4.82Z" />
    </svg>
  )
}

function scrollToHome(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const heroSection = document.querySelector<HTMLElement>('[aria-label="Hero section"]')

  if (!heroSection) {
    return
  }

  const isMobileNavigation = window.matchMedia('(max-width: 1023px)').matches
  const navbarOffset = isMobileNavigation ? 72 : document.querySelector('header')?.offsetHeight ?? 88
  const targetTop = heroSection.getBoundingClientRect().top + window.scrollY

  window.scrollTo({ top: Math.max(0, targetTop - navbarOffset), behavior: 'smooth' })
}

export function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const quickLinks = [
    { label: t.navbar.home, href: '#home' },
    { label: t.navbar.about, href: '#about' },
    { label: t.navbar.services, href: '#services' },
    { label: t.navbar.projects, href: '#projects' },
    { label: t.navbar.references, href: '#references' },
    { label: t.navbar.contact, href: '#contact' },
  ]

  return (
    <motion.footer
      className="border-t border-[var(--color-border)] bg-white"
      aria-label="Site footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-6 py-5 md:grid-cols-[220px_minmax(0,1fr)_320px]">
          <section className="self-start">
            <a href="#home" onClick={scrollToHome} aria-label={t.footer.homeAria}>
              <img src={logoUrl} alt="BEHA Harita Mühendislik" className="h-8 w-auto" />
            </a>
          </section>

          <section className="flex flex-col items-start text-left">
            <h2 className="mb-1.5 text-[12px] font-semibold leading-tight text-[var(--color-heading)]">{t.footer.quickLinksHeading}</h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-0.5 text-[10px] font-normal leading-[1.25] text-[var(--color-body)]">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="transition-colors duration-300 ease-standard hover:text-[var(--color-primary-600)]">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="flex flex-col items-start text-left">
            <h2 className="mb-1.5 text-[12px] font-semibold leading-tight text-[var(--color-heading)]">{t.footer.contactHeading}</h2>
            <address className="flex flex-col items-start gap-1 not-italic text-[10px] font-normal leading-[1.25] text-[var(--color-body)]">
              <p className="flex items-start gap-3">
                <LocationIcon />
                <span>{t.footer.address}</span>
              </p>
              <p className="flex items-start gap-3">
                <PhoneIcon />
                <a href="tel:+903124732133" className="transition-colors duration-300 ease-standard hover:text-[var(--color-primary-600)]">
                  (0312) 473 21 33
                </a>
              </p>
              <p className="flex items-start gap-3">
                <MailIcon />
                <a href="mailto:cemvur@behainsaat.com" className="transition-colors duration-300 ease-standard hover:text-[var(--color-primary-600)]">
                  cemvur@behainsaat.com
                </a>
              </p>
              <p className="flex items-start gap-3">
                <LinkedInIcon />
                <a
                  href="https://www.linkedin.com/in/cem-o%C4%9Fuz-vur-0ba07925/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 ease-standard hover:text-[var(--color-primary-600)]"
                >
                  LinkedIn
                </a>
              </p>
            </address>
          </section>
        </div>

      </div>

      <div className="w-full border-t border-[var(--color-border)]">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center px-6 text-[13px] font-normal leading-tight text-[var(--color-muted)]">
          {t.footer.copyright}
        </div>
      </div>
    </motion.footer>
  )
}
