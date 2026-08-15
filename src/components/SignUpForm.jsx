import { useEffect, useRef, useState } from 'react'
import { senses } from '../data/senses'
import { countries } from '../data/countries'

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

// "Sign up" popup — a registration form for launch access, opened from
// TopNav's Sign up button. A centered modal card, not a full-screen page.
// Submits to /api/send-invite, a Vercel serverless function that emails the
// submission over SMTP to the Arcel inboxes.
export default function SignUpForm({ open, onClose }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')

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
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    data.agree = form.agree.checked

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
      form.reset()
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

        <p className="font-roboto text-xs font-semibold uppercase tracking-[0.15em] text-arcel-blue">
          Arcel Konnect
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
          Enter the ecosystem.
        </h1>
        <p className="mt-4 font-roboto text-base text-white/60">
          Register your interest for launch access.
        </p>

        <form
          className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <Field label="First name">
            <input type="text" name="firstName" className={inputClass} />
          </Field>
          <Field label="Last name">
            <input type="text" name="lastName" className={inputClass} />
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
            <Combobox
              name="country"
              options={countries}
              getLabel={(c) => c.name}
              getValue={(c) => c.name}
              renderOption={(c) => `${c.flag} ${c.name}`}
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
                  renderOption={(c) => `${c.flag} ${c.dial}`}
                />
                <input type="tel" name="phone" className={inputClass} />
              </div>
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
