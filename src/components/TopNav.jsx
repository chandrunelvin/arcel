import { useState } from 'react'
import logo from '../assets/logo.png'
import SignUpForm from './SignUpForm'
import { LANGUAGES } from '../data/senses'

export default function TopNav({ language = 'en', copy, onLanguageChange }) {
  const [signUpOpen, setSignUpOpen] = useState(false)

  return (
    <header className="flex items-center justify-between gap-3 bg-white px-4 py-3 sm:px-10 sm:py-4">
      <div className="flex min-w-0 shrink items-center gap-3">
        <img src={logo} alt="Arcel — Alpha to omega across the built environment" className="h-8 w-auto shrink-0 sm:h-10 md:h-12" />
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <label className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-black/70">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
          </svg>
          <span className="sr-only">{copy.languageMenuLabel}</span>
          <select
            aria-label={copy.languageMenuLabel}
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="appearance-none bg-transparent pr-4 outline-none"
          >
            {LANGUAGES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/55" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
        <button
          type="button"
          onClick={() => setSignUpOpen(true)}
          className="shrink-0 whitespace-nowrap bg-arcel-blue px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-5"
        >
          {copy.signUp}
        </button>
      </div>

      <SignUpForm open={signUpOpen} onClose={() => setSignUpOpen(false)} language={language} copy={copy} />
    </header>
  )
}
