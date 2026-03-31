import React, { useEffect, useMemo, useState } from 'react'
import Moment from 'moment'
import { AtSign, Heart, KeyRound, Mail, MessageSquareText, Bookmark, UserRound, Menu } from 'lucide-react'
import toast from 'react-hot-toast'
import UserSidebar from '../components/UserSidebar'
import { useAppContext } from '../context/useAppContext'

const Profile = () => {
  const { userToken, userProfile, fetchUserProfile, updateUserPassword, navigate, user } = useAppContext()
  const [activeSection, setActiveSection] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  })

  useEffect(() => {
    if (!userToken) {
      navigate('/auth', { state: { from: '/profile' } })
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        await fetchUserProfile()
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [fetchUserProfile, navigate, userToken])

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const stats = useMemo(() => ({
    liked: userProfile?.likedBlogs?.length || 0,
    saved: userProfile?.savedBlogs?.length || 0,
    comments: userProfile?.comments?.length || 0
  }), [userProfile])

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsUpdatingPassword(true)
      const message = await updateUserPassword(passwordForm)
      toast.success(message)
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const renderBlogList = (blogs, emptyState) => {
    if (!blogs?.length) {
      return <div className='rounded-[1.75rem] bg-white/82 p-8 text-sm text-slate-500 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>{emptyState}</div>
    }

    return (
      <div className='grid gap-5 md:grid-cols-2'>
        {blogs.map((blog) => (
          <button
            key={blog._id}
            type='button'
            onClick={() => navigate(`/blog/${blog._id}`)}
            className='overflow-hidden rounded-[1.75rem] bg-white/85 text-left shadow-[0_20px_50px_rgba(39,46,66,0.06)] transition hover:-translate-y-1'
          >
            <img src={blog.image} alt={blog.title} className='h-48 w-full object-cover' />
            <div className='p-5'>
              <span className='rounded-full bg-[#f3f1ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#702ae1]'>{blog.category}</span>
              <h3 className='mt-4 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900'>{blog.title}</h3>
              <p className='mt-3 line-clamp-3 text-sm leading-7 text-slate-600' dangerouslySetInnerHTML={{ __html: blog.subTitle }}></p>
            </div>
          </button>
        ))}
      </div>
    )
  }

  const renderComments = () => {
    if (!userProfile?.comments?.length) {
      return <div className='rounded-[1.75rem] bg-white/82 p-8 text-sm text-slate-500 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>You have not commented on any blog yet.</div>
    }

    return (
      <div className='space-y-4'>
        {userProfile.comments.map((comment) => (
          <div key={comment._id} className='rounded-[1.75rem] bg-white/85 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-sm text-slate-500'>{Moment(comment.createdAt).format('MMMM D, YYYY')}</p>
                <h3 className='mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900'>{comment.blog.title}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${comment.isApproved ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#b45309]'}`}>
                {comment.isApproved ? 'Approved' : 'Pending approval'}
              </span>
            </div>
            <p className='mt-4 text-sm leading-7 text-slate-700'>{comment.content}</p>
            <button
              type='button'
              onClick={() => navigate(`/blog/${comment.blog._id}`)}
              className='mt-5 rounded-full border border-[#dddff2] bg-[#f7f8ff] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#b28cff] hover:text-[#702ae1]'
            >
              Open blog
            </button>
          </div>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className='rounded-[1.75rem] bg-white/82 p-8 text-sm text-slate-500 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>Loading your profile...</div>
    }

    if (!userProfile) {
      return <div className='rounded-[1.75rem] bg-white/82 p-8 text-sm text-slate-500 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>Unable to load your profile right now.</div>
    }

    if (activeSection === 'liked') {
      return renderBlogList(userProfile.likedBlogs, 'You have not liked any blogs yet.')
    }

    if (activeSection === 'saved') {
      return renderBlogList(userProfile.savedBlogs, 'You have not saved any blogs yet.')
    }

    if (activeSection === 'comments') {
      return renderComments()
    }

    return (
      <div className='space-y-6'>
        <div className='rounded-[2rem] bg-white/82 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)] backdrop-blur-xl sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Reader account</p>
              <h2 className='mt-4 font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-slate-900'>Your profile at a glance</h2>
            </div>
            <div className='rounded-full bg-[#eef0ff] px-4 py-2 text-sm font-semibold text-slate-600'>
              Joined {Moment(userProfile.user.createdAt).format('MMMM D, YYYY')}
            </div>
          </div>

          <div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            <div className='rounded-[1.5rem] bg-[#f7f8ff] p-5'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#702ae1] shadow-[0_10px_20px_rgba(39,46,66,0.06)]'>
                <UserRound className='h-5 w-5' />
              </div>
              <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Name</p>
              <p className='mt-2 text-base font-semibold text-slate-900'>{userProfile.user.name}</p>
            </div>

            <div className='rounded-[1.5rem] bg-[#f7f8ff] p-5'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#702ae1] shadow-[0_10px_20px_rgba(39,46,66,0.06)]'>
                <Mail className='h-5 w-5' />
              </div>
              <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Email</p>
              <p className='mt-2 break-all text-base font-semibold text-slate-900'>{userProfile.user.email}</p>
            </div>

            <div className='rounded-[1.5rem] bg-[#f7f8ff] p-5'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#702ae1] shadow-[0_10px_20px_rgba(39,46,66,0.06)]'>
                <AtSign className='h-5 w-5' />
              </div>
              <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Member since</p>
              <p className='mt-2 text-base font-semibold text-slate-900'>{Moment(userProfile.user.createdAt).format('YYYY')}</p>
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-[1.75rem] bg-white/82 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f1ff] text-[#702ae1]'>
              <Heart className='h-5 w-5' />
            </div>
            <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Liked blogs</p>
            <p className='mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] text-slate-900'>{stats.liked}</p>
          </div>
          <div className='rounded-[1.75rem] bg-white/82 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f1ff] text-[#702ae1]'>
              <Bookmark className='h-5 w-5' />
            </div>
            <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Saved blogs</p>
            <p className='mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] text-slate-900'>{stats.saved}</p>
          </div>
          <div className='rounded-[1.75rem] bg-white/82 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)]'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f1ff] text-[#702ae1]'>
              <MessageSquareText className='h-5 w-5' />
            </div>
            <p className='mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>Comments</p>
            <p className='mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] text-slate-900'>{stats.comments}</p>
          </div>
        </div>

        <div className='rounded-[2rem] bg-white/82 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)] backdrop-blur-xl sm:p-8'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#702ae1]/10 text-[#702ae1]'>
              <KeyRound className='h-5 w-5' />
            </div>
            <div>
              <h2 className='font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900'>Update password</h2>
              <p className='mt-1 text-sm text-slate-500'>Keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className='mt-6 grid gap-4 md:grid-cols-2'>
            <input
              type='password'
              placeholder='Current password'
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
              required
              className='rounded-2xl bg-[#f7f8ff] px-4 py-3 text-slate-700 outline-none transition focus:shadow-[0_0_0_3px_rgba(112,42,225,0.12)]'
            />
            <input
              type='password'
              placeholder='New password'
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
              required
              className='rounded-2xl bg-[#f7f8ff] px-4 py-3 text-slate-700 outline-none transition focus:shadow-[0_0_0_3px_rgba(112,42,225,0.12)]'
            />
            <button
              type='submit'
              disabled={isUpdatingPassword}
              className='rounded-2xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_34px_rgba(112,42,225,0.2)] transition hover:opacity-95 disabled:opacity-60'
            >
              {isUpdatingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex h-[76px] items-center justify-between border-b border-[#e7e6fb] bg-white/90 px-4 py-2 backdrop-blur sm:px-12'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setIsSidebarOpen(true)}
            className='flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f1ff] text-[#702ae1] md:hidden'
            aria-label='Open user sidebar'
          >
            <Menu className='h-5 w-5' />
          </button>
        <span onClick={() => navigate('/')} className='cursor-pointer'>
          <span className='font-bold text-black md:text-2xl'>Digital</span> <span className='font-bold italic text-[#702ae1] md:text-2xl'>Ethereal</span>
        </span>
        </div>
        <div className='text-right'>
          <p className='text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Reader workspace</p>
          <p className='text-sm font-semibold text-slate-800'>{user?.name || 'User'}</p>
        </div>
      </div>

      <div className='flex min-h-[calc(100vh-76px)] bg-[#f6f6ff]'>
        <UserSidebar activeSection={activeSection} setActiveSection={setActiveSection} stats={stats} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className='min-w-0 flex-1 p-4 md:p-10'>


          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default Profile
