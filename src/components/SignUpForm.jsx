import { useEffect } from 'react'
import { senses } from '../data/senses'

const countries = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'United Kingdom', 'United States', 'India', 'Singapore', 'Egypt', 'Other',
]

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-roboto text-xs uppercase tracking-[0.1em] text-white/50">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full border border-white/15 bg-white/[0.03] px-4 py-3 font-roboto text-sm text-white placeholder:text-white/30 outline-none focus:border-arcel-blue'

function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select
        className={`${inputClass} appearance-none pr-10`}
        defaultValue=""
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 10l6-6 6 6M6 14l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// "Sign up" popup — a registration form for launch access, opened from
// TopNav's Sign up button. Self-contained (no submit wiring yet — this is
// just the form UI matching the design).
export default function SignUpForm({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="animate-overlay-fade fixed inset-0 z-[100] overflow-y-auto bg-black">
      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:px-0 sm:py-16">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-10 flex h-10 w-10 items-center justify-center border border-arcel-blue text-white transition-colors hover:bg-arcel-blue/20 sm:right-0"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="font-roboto text-xs font-semibold uppercase tracking-[0.15em] text-arcel-blue">
          Arcel Konnect
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-6xl">
          Enter the ecosystem.
        </h1>
        <p className="mt-4 font-roboto text-base text-white/60">
          Register your interest for launch access.
        </p>

        <form
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="First name">
            <input type="text" name="firstName" className={inputClass} />
          </Field>
          <Field label="Last name">
            <input type="text" name="lastName" className={inputClass} />
          </Field>

          <Field label="Username">
            <input type="text" name="username" className={inputClass} />
          </Field>
          <Field label="Sex">
            <Select name="sex">
              <option value="" disabled>
                Select one
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </Select>
          </Field>

          <Field label="Pillar">
            <Select name="pillar">
              <option value="" disabled>
                Select one
              </option>
              {senses.map((sense) => (
                <option key={sense.key} value={sense.key}>
                  {sense.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Profession">
            <input type="text" name="profession" className={inputClass} />
          </Field>

          <Field label="Email">
            <input type="email" name="email" className={inputClass} />
          </Field>
          <Field label="Country">
            <Select name="country">
              <option value="" disabled>
                Select one
              </option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Phone">
              <input type="tel" name="phone" className={inputClass} />
            </Field>
          </div>

          <label className="flex items-start gap-3 font-roboto text-sm text-white/70 sm:col-span-2">
            <input
              type="checkbox"
              name="agree"
              className="mt-0.5 h-4 w-4 shrink-0 border border-white/30 bg-transparent accent-arcel-blue"
            />
            I agree to receive an invitation and accept the terms and conditions.
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-arcel-blue px-6 py-3.5 font-roboto text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Request invitation
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
