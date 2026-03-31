import React, { useEffect, useMemo, useState } from 'react'
import { KeyRound, Mail, MessageSquareText, Phone, UserRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext'
import { validateReaderAuth, validateReaderReset } from '../utils/authValidation'

const Auth = () => {
  const location = useLocation()
  const { loginUser, signupUser, verifyResetEmail, resetPassword, navigate, userToken } = useAppContext()
  const [mode, setMode] = useState('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    resetEmail: '',
    newPassword: ''
  })

  const redirectPath = useMemo(() => location.state?.from || '/', [location.state])

  useEffect(() => {
    if (userToken) {
      navigate(redirectPath)
    }
  }, [navigate, redirectPath, userToken])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
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

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateReaderAuth(mode, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        await signupUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          password: formData.password.trim()
        })
        toast.success('Your reader account is ready')
      } else {
        await loginUser({ email: formData.email.trim().toLowerCase(), password: formData.password })
        toast.success('Welcome back')
      }

      navigate(redirectPath)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyEmail = async (event) => {
    event.preventDefault()
    const validationErrors = validateReaderReset(1, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    try {
      const message = await verifyResetEmail(formData.resetEmail.trim().toLowerCase())
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
    const validationErrors = validateReaderReset(2, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      const message = await resetPassword({
        email: formData.resetEmail.trim().toLowerCase(),
        newPassword: formData.newPassword.trim()
      })
      toast.success(message)
      setMode('login')
      setResetStep(1)
      setErrors({})
      setFormData((current) => ({
        ...current,
        email: current.resetEmail.trim().toLowerCase(),
        password: '',
        newPassword: ''
      }))
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

      {mode === 'forgot' ? (
        <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="grid min-h-[560px] lg:grid-cols-2">
            <div className="flex items-center justify-center px-8 py-12 sm:px-14">
                <div className="w-full max-w-[340px]">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <KeyRound className="h-4 w-4" />
                    Password reset
                  </div>
                  <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Get back to your reading list.
                  </h1>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {resetStep === 1
                    ? 'Enter the email linked to your reader account.'
                    : `Email verified for ${formData.resetEmail}. Choose a new password.`}
                </p>

                  {resetStep === 1 ? (
                    <form onSubmit={handleVerifyEmail} className="mt-8 space-y-4">
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          name="resetEmail"
                          type="email"
                          value={formData.resetEmail}
                          onChange={updateField}
                          placeholder="Enter E-Mail"
                          required
                          className={getInputClassName('resetEmail')}
                        />
                      </div>
                      {errors.resetEmail ? <p className="text-sm text-red-500">{errors.resetEmail}</p> : null}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                      className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Checking...' : 'Verify Email'}
                    </button>
                  </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={updateField}
                          placeholder="Enter New Password"
                          required
                          className={getInputClassName('newPassword')}
                        />
                      </div>
                      {errors.newPassword ? <p className="text-sm text-red-500">{errors.newPassword}</p> : null}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                      className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
                  Back to Sign In
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-8 py-12 text-white sm:px-14">
              <div className="max-w-[320px] text-center">
                <h2 className="font-[Manrope] text-4xl font-extrabold leading-tight tracking-[-0.05em]">
                  Continue the conversation
                </h2>
                <p className="mt-5 text-base leading-8 text-white/85">
                  Recover your account and return to saved blogs, reactions, and comments without losing your place.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="relative grid min-h-[620px] lg:grid-cols-2">
            <div className={`flex items-center justify-center px-8 py-12 sm:px-14 ${mode === 'login' ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
              {mode === 'login' ? (
                <form onSubmit={handleAuthSubmit} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <MessageSquareText className="h-4 w-4" />
                    Reader login
                  </div>
                  <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign In
                  </h1>
                  <p className="mt-5 text-center text-sm text-slate-500">Sign in to save blogs and join discussions.</p>

                  <div className="mt-6 w-full space-y-3">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={updateField}
                        placeholder="Enter E-Mail"
                        required
                        className={getInputClassName('email')}
                      />
                    </div>
                    {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={updateField}
                        placeholder="Enter Password"
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
                    Forgot Password
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Please wait...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAuthSubmit} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <UserRound className="h-4 w-4" />
                    Create account
                  </div>
                  <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign Up
                  </h1>
                  <p className="mt-5 text-center text-sm text-slate-500">
                    Create your blog reader profile and keep your library in sync.
                  </p>

                  <div className="mt-6 w-full space-y-3">
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={updateField}
                        placeholder="Enter Full Name"
                        required
                        className={getInputClassName('name')}
                      />
                    </div>
                    {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="mobile"
                        type="text"
                        value={formData.mobile}
                        onChange={updateField}
                        placeholder="Enter Mobile Number"
                        required
                        className={getInputClassName('mobile')}
                      />
                    </div>
                    {errors.mobile ? <p className="text-sm text-red-500">{errors.mobile}</p> : null}
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={updateField}
                        placeholder="Enter E-Mail"
                        required
                        className={getInputClassName('email')}
                      />
                    </div>
                    {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={updateField}
                        placeholder="Create Password"
                        required
                        className={getInputClassName('password')}
                      />
                    </div>
                    {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Please wait...' : 'Sign Up'}
                  </button>
                </form>
              )}
            </div>

            <div
              className={`hidden lg:flex lg:absolute lg:top-0 lg:h-full lg:w-1/2 lg:items-center lg:justify-center lg:rounded-[30px] lg:bg-[linear-gradient(135deg,#702ae1,#57d2d0)] lg:px-10 lg:py-12 lg:text-white lg:transition-transform lg:duration-700 ${
                mode === 'signup' ? 'lg:translate-x-0' : 'lg:translate-x-full'
              }`}
            >
              <div className="max-w-[330px] text-center">
                <h2 className="font-[Manrope] text-5xl font-extrabold leading-tight tracking-[-0.05em]">
                  {mode === 'login' ? 'Build Your Reading Space' : 'Welcome Back to Your Blogs'}
                </h2>
                <p className="mt-6 text-base leading-8 text-white/85">
                  {mode === 'login'
                    ? 'Create an account to bookmark blog posts, react to stories, and keep up with every conversation.'
                    : 'Sign in to return to your saved blogs, comments, and reading activity.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="mt-8 rounded-xl border border-white/70 px-10 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 px-8 py-8 lg:hidden">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-6 py-8 text-center text-white">
                <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em]">
                  {mode === 'login' ? 'Need an account?' : 'Already registered?'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/85">
                  {mode === 'login'
                    ? 'Create your reader profile and start saving the blog posts you love.'
                    : 'Sign back in to continue reading and interacting with blog content.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
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

export default Auth
