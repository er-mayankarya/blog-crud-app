import React, { useEffect, useMemo, useState } from 'react'
import { AtSign, KeyRound, Mail, MessageSquareText, Phone, UserRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext'
import {
  validateReaderAuth,
  validateReaderReset,
  validateWriterAuth,
  validateWriterReset
} from '../utils/authValidation'

const accountTypes = [
  { value: 'normal', label: 'Normal User', description: 'Read, comment, save blogs, and follow authors.' },
  { value: 'author', label: 'Author', description: 'Publish blogs and manage your audience on the same platform.' }
]

const Auth = () => {
  const location = useLocation()
  const {
    loginUser,
    signupUser,
    registerWriter,
    verifyResetEmail,
    resetPassword,
    verifyWriterReset,
    resetWriterPassword,
    navigate,
    user
  } = useAppContext()

  const [mode, setMode] = useState('login')
  const [signupType, setSignupType] = useState('normal')
  const [resetType, setResetType] = useState('normal')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    mobile: '',
    username: '',
    description: '',
    password: '',
    resetEmail: '',
    resetPhone: '',
    newPassword: ''
  })

  const redirectPath = useMemo(() => location.state?.from || '/', [location.state])
  const requestedMode = location.state?.mode

  useEffect(() => {
    if (user) {
      navigate(redirectPath)
    }
  }, [navigate, redirectPath, user])

  useEffect(() => {
    if (requestedMode === 'login' || requestedMode === 'signup') {
      setMode(requestedMode)
      setErrors({})
    }
  }, [requestedMode])

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

    const validationErrors = signupType === 'author'
      ? validateWriterAuth('register', {
        ...formData,
        phone: formData.mobile
      })
      : validateReaderAuth('signup', formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (signupType === 'author') {
        await registerWriter({
          name: formData.name.trim(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.mobile.trim(),
          description: formData.description.trim(),
          password: formData.password.trim()
        })
        toast.success('Your author account is ready')
      } else {
        await signupUser({
          name: formData.name.trim(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          password: formData.password.trim()
        })
        toast.success('Your account is ready')
      }

      navigate(redirectPath)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const validationErrors = validateReaderAuth('login', formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      await loginUser({
        login: formData.login.trim(),
        password: formData.password
      })
      toast.success('Welcome back')
      navigate(redirectPath)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyReset = async (event) => {
    event.preventDefault()

    const validationErrors = resetType === 'author'
      ? validateWriterReset(1, formData)
      : validateReaderReset(1, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (resetType === 'author') {
        const message = await verifyWriterReset({
          email: formData.resetEmail.trim().toLowerCase(),
          phone: formData.resetPhone.trim()
        })
        toast.success(message)
      } else {
        const message = await verifyResetEmail(formData.resetEmail.trim().toLowerCase())
        toast.success(message)
      }

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

    const validationErrors = resetType === 'author'
      ? validateWriterReset(2, formData)
      : validateReaderReset(2, formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (resetType === 'author') {
        const message = await resetWriterPassword({
          email: formData.resetEmail.trim().toLowerCase(),
          phone: formData.resetPhone.trim(),
          newPassword: formData.newPassword.trim()
        })
        toast.success(message)
      } else {
        const message = await resetPassword({
          email: formData.resetEmail.trim().toLowerCase(),
          newPassword: formData.newPassword.trim()
        })
        toast.success(message)
      }

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

  const renderAccountTypeToggle = (value, onChange) => (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {accountTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
            value === type.value
              ? 'border-[#702ae1] bg-[#f3f1ff] shadow-[0_14px_30px_rgba(112,42,225,0.12)]'
              : 'border-[#ebe9fb] bg-white'
          }`}
        >
          <p className="text-sm font-bold text-slate-900">{type.label}</p>
          <p className="mt-2 text-xs leading-6 text-slate-500">{type.description}</p>
        </button>
      ))}
    </div>
  )

  return (
    <div className="ethereal-shell flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f6f6ff] px-4 py-10 sm:px-6 lg:px-10">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      {mode === 'forgot' ? (
        <div className="relative z-10 w-full max-w-[1080px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="grid min-h-[580px] lg:grid-cols-2">
            <div className="flex items-center justify-center px-8 py-12 sm:px-14">
              <div className="w-full max-w-[360px]">
                <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                  <KeyRound className="h-4 w-4" />
                  Password reset
                </div>
                <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                  Recover your access
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {resetStep === 1
                    ? 'Choose which account you want to recover and verify the required details.'
                    : `Set a new password for ${formData.resetEmail}.`}
                </p>

                {resetStep === 1 ? renderAccountTypeToggle(resetType, setResetType) : null}

                {resetStep === 1 ? (
                  <form onSubmit={handleVerifyReset} className="mt-8 space-y-4">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="resetEmail"
                        type="email"
                        value={formData.resetEmail}
                        onChange={updateField}
                        placeholder="Enter email"
                        required
                        className={getInputClassName('resetEmail')}
                      />
                    </div>
                    {errors.resetEmail ? <p className="text-sm text-red-500">{errors.resetEmail}</p> : null}

                    {resetType === 'author' ? (
                      <>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            name="resetPhone"
                            type="text"
                            value={formData.resetPhone}
                            onChange={updateField}
                            placeholder="Enter author phone number"
                            required
                            className={getInputClassName('resetPhone')}
                          />
                        </div>
                        {errors.resetPhone ? <p className="text-sm text-red-500">{errors.resetPhone}</p> : null}
                      </>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Checking...' : 'Verify account'}
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
                        placeholder="Enter new password"
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
                      {isSubmitting ? 'Updating...' : 'Update password'}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="mt-6 cursor-pointer text-sm font-semibold text-[#702ae1] transition hover:text-[#5521b0]"
                >
                  Back to Account Access
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-8 py-12 text-white sm:px-14">
              <div className="max-w-[320px] text-center">
                <h2 className="font-[Manrope] text-4xl font-extrabold leading-tight tracking-[-0.05em]">
                  One door for every account
                </h2>
                <p className="mt-5 text-base leading-8 text-white/85">
                  Reader and author accounts now start from the same public access flow, with the right onboarding shown only when needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[1080px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
          <div className="relative grid min-h-[680px] lg:grid-cols-2">
            <div className={`flex items-center justify-center px-8 py-12 sm:px-14 ${mode === 'login' ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <MessageSquareText className="h-4 w-4" />
                    Unified login
                  </div>
                  <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign In
                  </h1>
                  <p className="mt-5 text-center text-sm text-slate-500">
                    Login once and we will unlock the right experience for your account.
                  </p>

                  <div className="mt-6 w-full space-y-3">
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="login"
                        type="text"
                        value={formData.login}
                        onChange={updateField}
                        placeholder="Email, username, or mobile"
                        required
                        className={getInputClassName('login')}
                      />
                    </div>
                    {errors.login ? <p className="text-sm text-red-500">{errors.login}</p> : null}

                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={updateField}
                        placeholder="Enter password"
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
                    Forgot password
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
                <form onSubmit={handleAuthSubmit} className="mx-auto flex w-full max-w-[360px] flex-col">
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                    <UserRound className="h-4 w-4" />
                    Unified register
                  </div>
                  <h1 className="mt-4 font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                    Sign Up
                  </h1>
                  <p className="mt-5 text-sm text-slate-500">
                    Create one account first, then choose whether you are joining as a normal user or an author.
                  </p>

                  {renderAccountTypeToggle(signupType, setSignupType)}

                  <div className="mt-6 space-y-3">
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={updateField}
                        placeholder={signupType === 'author' ? 'Author name' : 'Full name'}
                        required
                        className={getInputClassName('name')}
                      />
                    </div>
                    {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}

                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={updateField}
                        placeholder={signupType === 'author' ? 'Choose author username' : 'Choose username'}
                        required
                        className={getInputClassName('username')}
                      />
                    </div>
                    {errors.username ? <p className="text-sm text-red-500">{errors.username}</p> : null}

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={updateField}
                        placeholder="Enter email"
                        required
                        className={getInputClassName('email')}
                      />
                    </div>
                    {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}

                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="mobile"
                        type="text"
                        value={formData.mobile}
                        onChange={updateField}
                        placeholder={signupType === 'author' ? 'Author phone number' : 'Mobile number'}
                        required
                        className={getInputClassName('mobile')}
                      />
                    </div>
                    {errors.mobile ? <p className="text-sm text-red-500">{errors.mobile}</p> : errors.phone ? <p className="text-sm text-red-500">{errors.phone}</p> : null}

                    {signupType === 'author' ? (
                      <>
                        <div className="relative">
                          <MessageSquareText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={updateField}
                            placeholder="Tell readers what you write about"
                            required
                            className={`h-28 w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)] ${
                              errors.description ? 'border border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]' : ''
                            }`}
                          />
                        </div>
                        {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
                      </>
                    ) : null}

                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={updateField}
                        placeholder="Create password"
                        required
                        className={getInputClassName('password')}
                      />
                    </div>
                    {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Please wait...' : signupType === 'author' ? 'Create Author Account' : 'Create Account'}
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
                  {mode === 'login' ? 'One Login for Readers and Authors' : 'Create the Right Account Once'}
                </h2>
                <p className="mt-6 text-base leading-8 text-white/85">
                  {mode === 'login'
                    ? 'Sign in from one place and we will route you into reading, commenting, or author publishing automatically.'
                    : 'Start as a normal user or author from the same register flow, without a separate landing-page auth split.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="mt-8 cursor-pointer rounded-xl border border-white/70 px-10 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 px-8 py-8 lg:hidden">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-6 py-8 text-center text-white">
                <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em]">
                  {mode === 'login' ? 'Need an account?' : 'Already have one?'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/85">
                  {mode === 'login'
                    ? 'Create one account and choose whether you are joining as a normal user or author.'
                    : 'Use the same login entry for readers and authors whenever you come back.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="mt-6 cursor-pointer rounded-xl border border-white/70 px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
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
