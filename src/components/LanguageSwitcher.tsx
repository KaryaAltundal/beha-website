import { useLanguage } from '../i18n/LanguageContext'

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
      className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[0.02em] text-[var(--color-body)] transition-colors duration-200 ease-standard hover:text-[var(--color-primary-600)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
      </svg>
      <span className="flex items-center gap-1">
        <span className={language === 'tr' ? 'text-[var(--color-primary-600)]' : ''}>TR</span>
        <span className="text-[var(--color-border)]">/</span>
        <span className={language === 'en' ? 'text-[var(--color-primary-600)]' : ''}>EN</span>
      </span>
    </button>
  )
}
