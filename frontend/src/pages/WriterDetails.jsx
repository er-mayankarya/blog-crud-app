import React, { useCallback, useEffect, useState } from 'react'
import { LuBookOpen, LuHeart, LuRss, LuShare2, LuUserRound } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/useAppContext'

const WriterDetails = () => {
  const { username, writerId } = useParams()
  const { api, navigate, userToken, followingWriterIds, toggleFollowWriter } = useAppContext()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)

  const fetchWriterProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get(username ? `/api/writer/public/${username}` : `/api/writer/public/id/${writerId}`)

      if (!data.success) {
        throw new Error(data.message)
      }

      setProfile(data.profile)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [api, username, writerId])

  useEffect(() => {
    fetchWriterProfile()
  }, [fetchWriterProfile])

  const handleFollow = async () => {
    if (!profile?.writer?._id) return

    if (!userToken) {
      toast.error('Please login to follow writers')
      navigate('/auth', { state: { from: username ? `/writers/${username}` : `/writers/id/${writerId}` } })
      return
    }

    try {
      setIsFollowingLoading(true)
      await toggleFollowWriter(profile.writer._id)
      setProfile((currentProfile) => currentProfile ? {
        ...currentProfile,
        stats: {
          ...currentProfile.stats,
          followers: Math.max(0, (currentProfile.stats.followers || 0) + (isFollowing ? -1 : 1))
        }
      } : currentProfile)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsFollowingLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="ethereal-shell min-h-screen bg-[#f6f6ff]">
        <div className="ethereal-orb ethereal-orb-primary" />
        <div className="ethereal-orb ethereal-orb-secondary" />
        <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="ethereal-shell min-h-screen bg-[#f6f6ff]">
        <div className="ethereal-orb ethereal-orb-primary" />
        <div className="ethereal-orb ethereal-orb-secondary" />
        <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
        <div className="mx-auto w-full px-4 py-20 text-center sm:px-6 lg:px-10">
          <p className="text-slate-500">Writer profile unavailable.</p>
        </div>
      </div>
    )
  }

  const isFollowing = followingWriterIds.includes(profile.writer._id)

  return (
    <div className="ethereal-shell min-h-screen bg-[#f6f6ff]">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <section className="rounded-[2.5rem] bg-white/78 p-6 shadow-[0_24px_70px_rgba(39,46,66,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[linear-gradient(135deg,#702ae1,#57d2d0)] p-1 shadow-[0_20px_50px_rgba(112,42,225,0.22)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#702ae1]">
                  <LuUserRound className="h-20 w-20" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl">
                {profile.writer.name}
              </h1>
              <p className="mt-3 text-base font-medium text-[#702ae1]">@{profile.writer.username}</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                {profile.writer.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-2xl font-extrabold text-[#702ae1]">{profile.stats.followers}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#702ae1]">{profile.stats.blogs}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#702ae1]">{profile.stats.reads}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Reads</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#702ae1]">{profile.stats.likes}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Likes</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleFollow}
                  disabled={isFollowingLoading}
                  className="rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_34px_rgba(112,42,225,0.22)] transition hover:opacity-95 disabled:opacity-60"
                >
                  {isFollowingLoading ? 'Working...' : isFollowing ? `Following ${profile.writer.name}` : `Follow ${profile.writer.name}`}
                </button>
                <button type="button" className="rounded-full bg-white p-3 text-slate-600 shadow-[0_10px_24px_rgba(39,46,66,0.08)]">
                  <LuShare2 />
                </button>
                <button type="button" className="rounded-full bg-white p-3 text-slate-600 shadow-[0_10px_24px_rgba(39,46,66,0.08)]">
                  <LuRss />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-slate-900">Latest Insights</h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-[linear-gradient(135deg,#702ae1,#57d2d0)]" />
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <LuBookOpen />
              <span className="text-sm">{profile.blogs.length} published stories</span>
            </div>
          </div>

          {profile.blogs.length ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {profile.blogs.map((blog) => (
                <button
                  key={blog._id}
                  type="button"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="overflow-hidden rounded-[2rem] bg-white/80 text-left shadow-[0_20px_40px_rgba(39,46,66,0.06)] transition hover:-translate-y-1"
                >
                  <img src={blog.image} alt={blog.title} className="aspect-[4/3] w-full object-cover" />
                  <div className="p-5">
                    <span className="rounded-full bg-[#f3f1ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#702ae1]">
                      {blog.category}
                    </span>
                    <h3 className="mt-4 font-[Manrope] text-2xl font-extrabold leading-tight tracking-[-0.04em] text-slate-900">
                      {blog.title}
                    </h3>
                    <div className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600" dangerouslySetInnerHTML={{ __html: blog.subTitle }} />
                    <div className="mt-5 flex items-center gap-5 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1"><LuHeart className="h-4 w-4" />{blog.likesCount || 0}</span>
                      <span>{blog.commentsCount || 0} comments</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white/70 p-8 text-sm text-slate-500 shadow-[0_20px_40px_rgba(39,46,66,0.05)]">
              No published blogs from this writer yet.
            </div>
          )}
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default WriterDetails
