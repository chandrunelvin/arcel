import { useEffect, useRef, useState } from 'react'
import { senses } from '../data/senses'
import { countries } from '../data/countries'
import arcelKonnectLogo from '../assets/Arcel-Konnect-form-logo.png'

// every country has a real dial code, so the phone selector reuses the
// same full list — flag + name + dial code stay in sync everywhere.
const phoneCodes = countries

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

function Select({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        className={`${inputClass} appearance-none pr-10 ${className}`}
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

// Searchable dropdown for long lists (country / phone code) — a plain
// <select> has no built-in search and, being native, can't have its list
// styled or its scroll contained, so it's swapped for this custom popover.
// `overscroll-contain` on the scrollable list stops scrolling within it
// from chaining up to the page once the list hits its own top/bottom edge.
function Combobox({
  name,
  options,
  getLabel,
  getValue,
  getKey = getValue,
  renderOption,
  placeholder = 'Select one',
  className = '',
  resetSignal,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    setOpen(false)
    setQuery('')
    setSelectedKey('')
  }, [resetSignal])

  const filtered = options.filter((opt) => getLabel(opt).toLowerCase().includes(query.trim().toLowerCase()))
  const selected = options.find((opt) => getKey(opt) === selectedKey)

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selected ? getValue(selected) : ''} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left ${className}`}
      >
        <span className={`truncate ${selected ? '' : 'text-white/30'}`}>
          {selected ? renderOption(selected) : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 text-white/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 10l6-6 6 6M6 14l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full border border-white/15 bg-[#0a0a0a] shadow-xl">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full border-b border-white/10 bg-transparent px-4 py-2.5 font-roboto text-sm text-white placeholder:text-white/30 outline-none"
          />
          <div className="max-h-56 overscroll-contain overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-2.5 font-roboto text-sm text-white/40">No matches</p>
            )}
            {filtered.map((opt) => (
              <button
                key={getKey(opt)}
                type="button"
                onClick={() => {
                  setSelectedKey(getKey(opt))
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-roboto text-sm text-white hover:bg-white/5"
              >
                {renderOption(opt)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FlagIcon({ country }) {
  return (
    <img
      src={country.flagUrl}
      alt={country.flagAlt}
      className="h-4 w-6 rounded-[2px] border border-white/10 object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
      loading="lazy"
    />
  )
}

const standardTerms = [
  {
    title: 'Invitation request only',
    body:
      'Submitting this form requests access to Arcel Konnect. It does not guarantee acceptance, onboarding, or immediate platform availability.',
  },
  {
    title: 'Information accuracy',
    body:
      'You confirm that the details you submit are accurate, current, and provided with authority to represent yourself or your organization.',
  },
  {
    title: 'Communication consent',
    body:
      'Arcel may use your submitted contact details to respond to your request, share onboarding updates, and send essential product communication related to Arcel Konnect.',
  },
  {
    title: 'Privacy and review',
    body:
      'Your information will be reviewed internally for launch access coordination and handled as business contact data for Arcel Konnect operations.',
  },
  {
    title: 'Platform updates',
    body:
      'Arcel may refine platform features, access criteria, timelines, and onboarding requirements before or after launch without prior notice.',
  },
  {
    title: 'Acceptable use',
    body:
      'Any eventual access to Arcel Konnect must be used lawfully and in a way that does not interfere with the platform, its users, or Arcel intellectual property.',
  },
]

// "Sign up" popup — a registration form for launch access, opened from
// TopNav's Sign up button. A centered modal card, not a full-screen page.
// Submits to /api/send-invite, a Vercel serverless function that emails the
// submission over SMTP to the Arcel inboxes.
export default function SignUpForm({ open, onClose }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [formSeed, setFormSeed] = useState(0)

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

  // fresh form each time the popup reopens
  useEffect(() => {
    if (open) {
      setStatus('idle')
      setErrorMessage('')
      setShowTerms(false)
      setFormSeed((seed) => seed + 1)
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    data.agree = form.agree.checked

    if (!data.agree) {
      setStatus('error')
      setErrorMessage('Please accept the terms and conditions to continue.')
      return
    }

    setStatus('sending')
    setErrorMessage('')
    try {
      const res = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong')
      }
      setStatus('sent')
      setShowTerms(false)
      setFormSeed((seed) => seed + 1)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }

  if (!open) return null

  return (
    <div
      className="animate-overlay-fade fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 py-10 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="relative w-full max-w-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-arcel-blue text-white transition-colors hover:bg-arcel-blue/20 sm:right-8 sm:top-8"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <img
          src={arcelKonnectLogo}
          alt="Arcel Konnect"
          className="h-8 w-auto sm:h-10"
        />
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
          Enter the ecosystem.
        </h1>
        <p className="mt-4 font-roboto text-base text-white/60">
          Register your interest for launch access.
        </p>

        <form
          key={formSeed}
          className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <Field label="First name">
            <input type="text" name="firstName" className={inputClass} required />
          </Field>
          <Field label="Last name">
            <input type="text" name="lastName" className={inputClass} required />
          </Field>

          <Field label="Pillar">
            <Select name="pillar" required>
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
            <input type="text" name="profession" className={inputClass} required />
          </Field>

          <Field label="Email">
            <input type="email" name="email" className={inputClass} required />
          </Field>
          <Field label="Country">
            <Combobox
              name="country"
              options={countries}
              getLabel={(c) => c.name}
              getValue={(c) => c.name}
              renderOption={(c) => (
                <>
                  <FlagIcon country={c} />
                  <span>{c.name}</span>
                </>
              )}
              resetSignal={formSeed}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Phone">
              <div className="flex gap-2">
                <Combobox
                  name="phoneCode"
                  className="w-[140px] shrink-0"
                  options={phoneCodes}
                  getLabel={(c) => `${c.name} ${c.code} ${c.dial}`}
                  getValue={(c) => c.dial}
                  getKey={(c) => c.code}
                  renderOption={(c) => (
                    <>
                      <FlagIcon country={c} />
                      <span>{c.dial}</span>
                    </>
                  )}
                  resetSignal={formSeed}
                />
                <input type="tel" name="phone" className={inputClass} required />
              </div>
            </Field>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 font-roboto text-sm text-white/70">
              <input
                type="checkbox"
                name="agree"
                required
                className="mt-0.5 h-4 w-4 shrink-0 border border-white/30 bg-transparent accent-arcel-blue"
              />
              <span>
                I agree to receive an invitation and accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms((value) => !value)}
                  className="text-arcel-blue underline underline-offset-4"
                >
                  standard terms and conditions
                </button>
                .
              </span>
            </label>

            {showTerms && (
              <div className="mt-4 border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-roboto text-xs font-semibold uppercase tracking-[0.14em] text-arcel-blue">
                      Terms and Conditions
                    </p>
                    <p className="mt-1 font-roboto text-sm text-white/50">
                      Standard online terms for Arcel Konnect invitation requests.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTerms(false)}
                    className="font-roboto text-xs uppercase tracking-[0.12em] text-white/50 transition-colors hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {standardTerms.map((term, index) => (
                    <div key={term.title} className="border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                      <p className="font-roboto text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        {index + 1}. {term.title}
                      </p>
                      <p className="mt-1.5 font-roboto text-sm leading-6 text-white/65">
                        {term.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center gap-2 bg-arcel-blue px-6 py-3.5 font-roboto text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Request invitation'}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {status === 'sent' && (
              <p className="font-roboto text-sm text-arcel-blue">
                Thanks — your request has been sent.
              </p>
            )}
            {status === 'error' && (
              <p className="font-roboto text-sm text-red-400">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
