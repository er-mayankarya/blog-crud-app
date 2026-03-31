import React from 'react'
import { LuMail, LuNewspaper, LuSparkles } from 'react-icons/lu'
import { useAppContext } from '../context/useAppContext'

const newsletterHighlights = [
  'Weekly editorial digest from the latest stories',
  'Fresh design, startup, and technology reads',
  'No spam, only thoughtful updates worth opening'
]

const Newsletter = ({ containerClassName = '' }) => {
  const { navigate } = useAppContext()

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section id="newsletter-section" className="pb-10">
      <div className={`relative overflow-hidden rounded-[2.5rem] bg-[#eef0ff] px-6 py-12 sm:px-10 lg:px-16 lg:py-16 ${containerClassName}`}>
        <div className="absolute -left-12 -top-16 h-52 w-52 rounded-full bg-[#702ae1]/12 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-[#00675e]/12 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
         

            <h2 className="mt-5 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl">
              Stay in the loop without losing the vibe.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Subscribe to get a clean weekly drop of standout stories, internet thinking, and editorial picks from the platform delivered straight to your inbox.
            </p>

            <div className="mt-8 grid gap-3">
              {newsletterHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-4 text-sm text-slate-600 shadow-[0_18px_36px_rgba(39,46,66,0.05)]"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#702ae1]/10 text-[#702ae1]">
                    <LuSparkles className="text-sm" />
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 shadow-[0_28px_60px_rgba(39,46,66,0.08)] sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] text-2xl text-white shadow-[0_20px_40px_rgba(112,42,225,0.2)]">
              <LuMail />
            </div>

            <h3 className="mt-6 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
              Get the next issue
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your email to receive curated reads, feature drops, and a short digest of what is worth your attention this week.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl bg-white px-5 py-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_4px_rgba(112,42,225,0.08)]"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-6 py-4 font-bold text-white shadow-[0_20px_40px_rgba(112,42,225,0.2)] transition hover:-translate-y-0.5"
              >
                Subscribe to newsletter
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>No spam. Unsubscribe anytime.</p>
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-left font-semibold text-[#702ae1] transition hover:text-[#5521b0]"
              >
                Already a reader? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
