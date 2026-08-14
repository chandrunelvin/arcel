import logo from '../assets/logo.png'

export default function TopNav() {
  return (
    <header className="flex items-center justify-between gap-3 bg-white px-4 py-3 sm:px-10 sm:py-4">
      <div className="flex min-w-0 shrink items-center gap-3">
        <img src={logo} alt="Arcel — Alpha to omega across the built environment" className="h-8 w-auto shrink-0 sm:h-10 md:h-12" />
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-black/70">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
          </svg>
          EN
        </button>
        <button className="shrink-0 whitespace-nowrap bg-arcel-blue px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-5">
          Sign up
        </button>
      </div>
    </header>
  )
}
