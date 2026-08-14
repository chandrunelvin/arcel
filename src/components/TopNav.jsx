import logo from '../assets/logo.png'

export default function TopNav() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 sm:px-10">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Arcel — Alpha to omega across the built environment" className="h-10 w-auto sm:h-12" />
      </div>

      <div className="flex items-center gap-5">
        <button className="flex items-center gap-1.5 text-sm text-black/70">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
          </svg>
          EN
        </button>
        <button className="rounded-md bg-arcel-blue px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Sign up
        </button>
      </div>
    </header>
  )
}
