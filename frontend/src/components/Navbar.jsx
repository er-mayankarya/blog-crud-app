import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

const Navbar = ({ containerClassName = '' }) => {
  const { navigate, canAccessWriterDashboard, user } = useAppContext()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const handleNavigate = (path, options) => {
    navigate(path, options)
    setIsSidebarOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-none pt-4">
        <div className={`glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-6 ${containerClassName}`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-slate-700 transition hover:bg-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-[#702ae1] sm:text-2xl"
            >
              <span className='font-bold text-black md:text-2xl'>Digital</span> <span className='font-bold italic text-[#702ae1] md:text-2xl'>Ethereal</span>
            </button>
          </div>

          <div className="hidden items-center gap-6 text-base font-semibold text-slate-600 lg:flex xl:gap-8 xl:text-lg">
            <button
              type="button"
              onClick={() => location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
              className="ethereal-nav-link"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => navigate(user ? '/following' : '/auth', user ? undefined : { state: { from: '/following' } })}
              className="ethereal-nav-link"
            >
              Following
            </button>
            <button type="button" onClick={() => navigate('/#newsletter-section')} className="ethereal-nav-link">
              Newsletter
            </button>
            <button type="button" onClick={() => navigate('/#site-footer')} className="ethereal-nav-link">
              About
            </button>
            <button type="button" onClick={() => navigate('/writers')} className="ethereal-nav-link">
              Authors
            </button>
          </div>

          <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  {user.name}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/writer')}
                  className="rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-2 text-sm font-bold text-white shadow-[0_20px_40px_rgba(39,46,66,0.12)] transition hover:-translate-y-0.5 sm:px-6"
                >
                  {canAccessWriterDashboard ? 'Dashboard' : 'Become Author'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                  className="cursor-pointer rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                  className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-2 text-sm font-bold text-white shadow-[0_20px_40px_rgba(39,46,66,0.12)] transition hover:-translate-y-0.5 sm:px-6"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          <div className="lg:hidden">
            {user ? (
              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('/auth', { state: { mode: 'login' } })}
                  className="cursor-pointer rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('/auth', { state: { mode: 'signup' } })}
                  className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-2 text-sm font-bold text-white shadow-[0_20px_40px_rgba(39,46,66,0.12)] transition hover:-translate-y-0.5"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[70] transition ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className={`absolute inset-0 bg-[#101426]/35 backdrop-blur-sm transition ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close navigation overlay"
        />

        <aside className={`absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white px-5 py-6 shadow-[0_24px_80px_rgba(16,20,38,0.22)] transition-transform duration-300 sm:px-6 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-[#ebe9fb] pb-5">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-[#702ae1]"
            >
              <span className='font-bold text-black'>Digital</span> <span className='font-bold italic text-[#702ae1]'>Ethereal</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f1ff] text-[#702ae1]"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setIsSidebarOpen(false)
                } else {
                  handleNavigate('/')
                }
              }}
              className="flex w-full items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => handleNavigate(user ? '/following' : '/auth', user ? undefined : { state: { from: '/following' } })}
              className="flex w-full items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
            >
              Following
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/#newsletter-section')}
              className="flex w-full items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
            >
              Newsletter
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/#site-footer')}
              className="flex w-full items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/writers')}
              className="flex w-full items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
            >
              Authors
            </button>
              <button
                type="button"
                onClick={() => handleNavigate(user ? '/profile' : '/auth', user ? undefined : { state: { mode: 'login' } })}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
              >
                {user ? 'Profile' : 'Sign In'}
              </button>
            {!user ? (
              <button
                type="button"
                onClick={() => handleNavigate('/auth', { state: { mode: 'signup' } })}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] hover:text-[#702ae1]"
              >
                Create Account
              </button>
            ) : null}
          </div>

          <div className="mt-auto rounded-[1.75rem] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] p-5 text-white shadow-[0_24px_60px_rgba(112,42,225,0.18)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/72">Account access</p>
            <p className="mt-3 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em]">
              {canAccessWriterDashboard ? 'Open dashboard' : user ? 'Become an author' : 'Access your account'}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/84">
              {user
                ? 'Use your existing account to unlock the author dashboard when you are ready to publish.'
                : 'Start from one shared access flow, then continue as a normal user or author.'}
            </p>
            {user ? (
              <button
                type="button"
                onClick={() => handleNavigate('/writer')}
                className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#702ae1] shadow-[0_18px_34px_rgba(16,20,38,0.16)]"
              >
                {canAccessWriterDashboard ? 'Dashboard' : 'Become Author'}
              </button>
            ) : (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleNavigate('/auth', { state: { mode: 'login' } })}
                  className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm font-bold text-[#702ae1] shadow-[0_18px_34px_rgba(16,20,38,0.16)]"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('/auth', { state: { mode: 'signup' } })}
                  className="cursor-pointer rounded-full border border-white/70 px-5 py-3 text-sm font-bold text-white"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

export default Navbar
