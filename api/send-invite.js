import nodemailer from 'nodemailer'

// Vercel serverless function backing the "Sign up" popup (SignUpForm.jsx).
// Sends the submitted form to the two Arcel inboxes over SMTP — credentials
// come from environment variables (set in the Vercel project settings),
// never hard-coded, since anything in the client bundle is public.
const RECIPIENTS = ['konnect@arcelintelligence.com', 'chandrunelvin@gmail.com']

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'pillar', 'profession', 'country', 'phone']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body ?? {}
  const missing = REQUIRED_FIELDS.filter((field) => !String(body[field] ?? '').trim())
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
  }
  if (!body.agree) {
    return res.status(400).json({ error: 'Terms must be accepted' })
  }

  const { firstName, lastName, email, pillar, profession, country, phoneCode, phone } = body

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const lines = [
    ['First name', firstName],
    ['Last name', lastName],
    ['Email', email],
    ['Pillar', pillar],
    ['Profession', profession],
    ['Country', country],
    ['Phone', `${phoneCode ?? ''} ${phone}`.trim()],
  ]
  const text = lines.map(([label, value]) => `${label}: ${value}`).join('\n')
  const html = `<table cellpadding="6">${lines
    .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`)
    .join('')}</table>`

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: RECIPIENTS,
      replyTo: email,
      subject: `Arcel Konnect — new invitation request from ${firstName} ${lastName}`,
      text,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('send-invite failed', err)
    return res.status(502).json({ error: 'Failed to send email' })
  }
}
