import React, { useState } from 'react'
import { AtSign, FileText, KeyRound, Mail, Phone, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/useAppContext'
import { validateWriterAuth, validateWriterReset } from '../../utils/authValidation'

const WriterAuth = () => {
  const { registerWriter, loginWriter, verifyWriterReset, resetWriterPassword, becomeAuthor, user, userToken } = useAppContext()
  const [mode, setMode] = useState('login')
  const [resetStep, setResetStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    description: '',
    login: '',
    password: '',
    resetEmail: '',
    resetPhone: '',
    newPassword: '',
    authorConsent: false
  })

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => {
      if (!current[name]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setResetStep(1)
    setErrors({})
  }

  const getInputClassName = (fieldName) =>
    `w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)] ${
      errors[fieldName] ? 'border border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]' : ''
    }`

  const handleRegister = async (event) => {
    event.preventDefault()
    const validationErrors = validateWriterAuth('register', formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      await registerWriter({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        password: formData.password.trim()
      })
      toast.success('Writer account created successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const validationErrors = validateWriterAuth('login', formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      await loginWriter({
        login: formData.login.trim(),
        password: formData.password
      })
      toast.success('Welcome to your writer dashboard')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyReset = async (event) => {
    event.preventDefault()
    const validationErrors = validateWriterReset(1, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      const message = await verifyWriterReset({
        email: formData.resetEmail.trim().toLowerCase(),
        phone: formData.resetPhone.trim()
      })
      toast.success(message)
      setResetStep(2)
      setErrors({})
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    const validationErrors = validateWriterReset(2, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      const message = await resetWriterPassword({
        email: formData.resetEmail.trim().toLowerCase(),
        phone: formData.resetPhone.trim(),
        newPassword: formData.newPassword.trim()
      })
      toast.success(message)
      setErrors({})
      setFormData((current) => ({
        ...current,
        login: current.resetEmail.trim().toLowerCase(),
        password: '',
        newPassword: ''
      }))
      setMode('login')
      setResetStep(1)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBecomeAuthor = async (event) => {
    event.preventDefault()
    const validationErrors = {}

    if (!formData.authorConsent) {
      validationErrors.authorConsent = 'You must consent before becoming an author'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      await becomeAuthor({
        description: formData.description.trim(),
        consent: formData.authorConsent
      })
      toast.success('Your account is now an author account')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="ethereal-shell flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f6f6ff] px-4 py-10 sm:px-6 lg:px-10">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      {userToken && user && !user.isAuthor ? (
        <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="grid min-h-[620px] lg:grid-cols-2">
            <div className="flex items-center justify-center px-8 py-12 sm:px-14">
              <form onSubmit={handleBecomeAuthor} className="mx-auto flex w-full max-w-[360px] flex-col">
                <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                  <FileText className="h-4 w-4" />
                  Upgrade account
                </div>
                <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                  Become an author
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Keep your current account and unlock publishing while keeping the same username you already use.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-xl bg-[#f3f1ff] px-4 py-3 text-sm text-slate-600">
                    {user.name}
                  </div>
                  <div className="rounded-xl bg-[#f3f1ff] px-4 py-3 text-sm text-slate-600">
                    @{user.username}
                  </div>
                  <div className="rounded-xl bg-[#f3f1ff] px-4 py-3 text-sm text-slate-600">
                    {user.email}
                  </div>
                  <div className="rounded-xl bg-[#f3f1ff] px-4 py-3 text-sm text-slate-600">
                    {user.mobile}
                  </div>

                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={updateField}
                      placeholder="Tell readers what you write about (optional)"
                      className={`h-28 w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)] ${
                        errors.description ? 'border border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]' : ''
                      }`}
                    />
                  </div>
                  {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}

                  <label className={`flex items-start gap-3 rounded-xl px-4 py-4 text-sm text-slate-600 ${errors.authorConsent ? 'border border-red-400 bg-red-50/60' : 'bg-[#f3f1ff]'}`}>
                    <input
                      name="authorConsent"
                      type="checkbox"
                      checked={formData.authorConsent}
                      onChange={updateField}
                      className="mt-1 h-4 w-4 accent-[#702ae1]"
                    />
                    <span>
                      I understand this account will be upgraded to author access, and I want to unlock the publishing dashboard on this same account.
                    </span>
                  </label>
                  {errors.authorConsent ? <p className="text-sm text-red-500">{errors.authorConsent}</p> : null}
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="mt-7 w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Upgrading...' : 'Become Author'}
                </button>
              </form>
            </div>

            <div className="flex items-center justify-center bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-8 py-12 text-white sm:px-14">
              <div className="max-w-[320px] text-center">
                <h2 className="font-[Manrope] text-4xl font-extrabold leading-tight tracking-[-0.05em]">
                  One account, two experiences
                </h2>
                <p className="mt-5 text-base leading-8 text-white/85">
                  Stay signed in as a reader and unlock the author dashboard on the same profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : mode === 'forgot' ? (
        <div className="relative z-10 w-full max-w-[1100px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="grid min-h-[580px] lg:grid-cols-2">
            <div className="flex items-center justify-center px-8 py-12 sm:px-14">
              <div className="w-full max-w-[340px]">
                <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                  <KeyRound className="h-4 w-4" />
                  Writer recovery
                </div>
                <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                  Return to your publishing desk.
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {resetStep === 1
                    ? 'Verify your writer email and phone number.'
                    : `Writer verified for ${formData.resetEmail}. Set a new password below.`}
                </p>

                {resetStep === 1 ? (
                  <form onSubmit={handleVerifyReset} className="mt-8 space-y-4">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="resetEmail"
                        value={formData.resetEmail}
                        onChange={updateField}
                        type="email"
                        placeholder="Writer email"
                        required
                        className={getInputClassName('resetEmail')}
                      />
                    </div>
                    {errors.resetEmail ? <p className="text-sm text-red-500">{errors.resetEmail}</p> : null}
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="resetPhone"
                        value={formData.resetPhone}
                        onChange={updateField}
                        type="text"
                        placeholder="Writer phone number"
                        required
                        className={getInputClassName('resetPhone')}
                      />
                    </div>
                    {errors.resetPhone ? <p className="text-sm text-red-500">{errors.resetPhone}</p> : null}
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Checking...' : 'Verify Writer'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={updateField}
                        type="password"
                        placeholder="Enter new password"
                        required
                        className={getInputClassName('newPassword')}
                      />
                    </div>
                    {errors.newPassword ? <p className="text-sm text-red-500">{errors.newPassword}</p> : null}
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="mt-6 text-sm font-semibold text-[#702ae1] transition hover:text-[#5521b0]"
                >
                  Back to writer login
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-8 py-12 text-white sm:px-14">
              <div className="max-w-[320px] text-center">
                <h2 className="font-[Manrope] text-4xl font-extrabold leading-tight tracking-[-0.05em]">
                  Publish again with confidence
                </h2>
                <p className="mt-5 text-base leading-8 text-white/85">
                  Recover your writer access and get back to drafts, comments, and the stories you are building.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[1100px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="relative grid min-h-[680px] lg:grid-cols-2">
            <div className={`flex items-center justify-center px-8 py-12 sm:px-14 ${mode === 'login' ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <UserRound className="h-4 w-4" />
                    Writer login
                  </div>
                  <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign In
                  </h1>
                  <p className="mt-5 text-center text-sm text-slate-500">
                    Sign in with your email, phone number, or username.
                  </p>

                  <div className="mt-6 w-full space-y-3">
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="login"
                        value={formData.login}
                        onChange={updateField}
                        type="text"
                        placeholder="Email, phone, or username"
                        required
                        className={getInputClassName('login')}
                      />
                    </div>
                    {errors.login ? <p className="text-sm text-red-500">{errors.login}</p> : null}
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        value={formData.password}
                        onChange={updateField}
                        type="password"
                        placeholder="Password"
                        required
                        className={getInputClassName('password')}
                      />
                    </div>
                    {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="mt-4 self-end text-sm text-slate-500 transition hover:text-[#702ae1]"
                  >
                    Forgot password?
                  </button>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Logging in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <FileText className="h-4 w-4" />
                    Writer register
                  </div>
                  <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign Up
                  </h1>
                  <p className="mt-5 text-center text-sm text-slate-500">
                    Create your writer profile and open your publishing workspace.
                  </p>

                  <div className="mt-6 w-full space-y-3">
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={updateField}
                        type="text"
                        placeholder="Writer name"
                        required
                        className={getInputClassName('name')}
                      />
                    </div>
                    {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="username"
                        value={formData.username}
                        onChange={updateField}
                        type="text"
                        placeholder="Unique username"
                        required
                        className={getInputClassName('username')}
                      />
                    </div>
                    {errors.username ? <p className="text-sm text-red-500">{errors.username}</p> : null}
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={updateField}
                        type="email"
                        placeholder="Writer email"
                        required
                        className={getInputClassName('email')}
                      />
                    </div>
                    {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={updateField}
                        type="text"
                        placeholder="Writer phone number"
                        required
                        className={getInputClassName('phone')}
                      />
                    </div>
                    {errors.phone ? <p className="text-sm text-red-500">{errors.phone}</p> : null}
                    <div className="relative">
                      <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={updateField}
                        placeholder="Short writer description"
                        required
                        className={`h-28 w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)] ${
                          errors.description ? 'border border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]' : ''
                        }`}
                      />
                    </div>
                    {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        value={formData.password}
                        onChange={updateField}
                        type="password"
                        placeholder="Create password"
                        required
                        className={getInputClassName('password')}
                      />
                    </div>
                    {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Creating...' : 'Sign Up'}
                  </button>
                </form>
              )}
            </div>

            <div
              className={`hidden lg:flex lg:absolute lg:top-0 lg:h-full lg:w-1/2 lg:items-center lg:justify-center lg:rounded-[30px] lg:bg-[linear-gradient(135deg,#702ae1,#57d2d0)] lg:px-10 lg:py-12 lg:text-white lg:transition-transform lg:duration-700 ${
                mode === 'register' ? 'lg:translate-x-0' : 'lg:translate-x-full'
              }`}
            >
              <div className="max-w-[330px] text-center">
                <h2 className="font-[Manrope] text-5xl font-extrabold leading-tight tracking-[-0.05em]">
                  {mode === 'login' ? 'Open Your Writer Desk' : 'Welcome Back to Publish'}
                </h2>
                <p className="mt-6 text-base leading-8 text-white/85">
                  {mode === 'login'
                    ? 'Register to draft stories, manage comments, and build your writer identity on the platform.'
                    : 'Sign in to return to your drafts, published blogs, and writer dashboard.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="mt-8 rounded-xl border border-white/70 px-10 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 px-8 py-8 lg:hidden">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-6 py-8 text-center text-white">
                <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em]">
                  {mode === 'login' ? 'Need a writer account?' : 'Already a writer?'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/85">
                  {mode === 'login'
                    ? 'Create your writer profile with a unique username and short description.'
                    : 'Sign back in to continue publishing and managing your stories.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="mt-6 rounded-xl border border-white/70 px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WriterAuth
