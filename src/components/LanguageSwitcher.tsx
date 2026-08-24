import { useLanguage } from '../i18n/LanguageContext'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[0.02em] text-[var(--color-body)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4 text-[var(--color-primary-600)]"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
      </svg>
      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLanguage('tr')}
          aria-label="Türkçe"
          aria-current={language === 'tr'}
          className={`transition-colors duration-200 ease-standard hover:text-[var(--color-primary-600)] ${
            language === 'tr' ? 'text-[var(--color-primary-600)]' : ''
          }`}
        >
          TR
        </button>
        <span className="text-[var(--color-border)]" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-label="English"
          aria-current={language === 'en'}
          className={`transition-colors duration-200 ease-standard hover:text-[var(--color-primary-600)] ${
            language === 'en' ? 'text-[var(--color-primary-600)]' : ''
          }`}
        >
          EN
        </button>
      </span>
    </div>
  )
}
