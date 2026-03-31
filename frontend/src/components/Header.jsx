import React, { useMemo } from 'react'
import { LuArrowRight, LuBookOpen, LuCircleUserRound, LuSearch, LuSparkles, LuTrendingUp } from 'react-icons/lu'
import { useAppContext } from '../context/useAppContext'
import { formatDate, getFeaturedBlog, normalizeBlog } from '../utils/homeDisplay'

const Header = ({ containerClassName = '' }) => {
  const { blogs, input, setInput, navigate } = useAppContext()

  const normalizedBlogs = useMemo(() => blogs.map(normalizeBlog), [blogs])
  const featuredBlog = useMemo(() => getFeaturedBlog(normalizedBlogs), [normalizedBlogs])

  const featuredStats = [
    { label: 'Stories', value: blogs.length || '12+' },
    {
      label: 'Contributors',
      value: new Set(blogs.map((blog) => blog.writerName).filter(Boolean)).size || '24'
    },
    {
      label: 'Conversations',
      value: blogs.reduce((total, blog) => total + (blog.commentsCount || 0), 0) || '90+'
    }
  ]

  return (
    <header className="relative pb-12 pt-10 lg:pb-20 lg:pt-16">
      <div className={`grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] ${containerClassName}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#89f5e7] px-4 py-2 text-xs font-extrabold tracking-[0.24em] text-[#005c54] uppercase">
            <LuSparkles className="text-sm" />
            New stories daily
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-[Manrope] text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-6xl lg:text-7xl">
              The Future of <span className="text-[#702ae1] italic">Digital Thinking</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Explore an atmospheric collection of essays, ideas, and product stories where technology,
              design, and culture feel editorial instead of generic.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="relative flex-1">
              <LuSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Search for ideas, categories, or trends..."
                className="w-full rounded-2xl bg-[#eef0ff] py-4 pl-14 pr-4 text-slate-800 outline-none ring-0 transition placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(112,42,225,0.08)]"
              />
            </label>
            <button
              type="button"
              onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#702ae1] px-8 py-4 text-base font-bold text-white shadow-[0_20px_40px_rgba(112,42,225,0.22)] transition hover:-translate-y-0.5"
            >
              Discover
              <LuArrowRight />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featuredStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.75rem] bg-white/70 px-5 py-5 shadow-[0_20px_40px_rgba(39,46,66,0.06)] backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 scale-90 rounded-full bg-[radial-gradient(circle,rgba(112,42,225,0.14),transparent_60%)] blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 shadow-[0_32px_80px_rgba(39,46,66,0.12)] sm:p-6">
            {featuredBlog ? (
              <>
                <img
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  className="h-72 w-full rounded-[1.5rem] object-cover sm:h-80"
                />
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.22em] text-[#702ae1]">
                    <span className="inline-flex items-center gap-2">
                      <LuTrendingUp />
                      Trending now
                    </span>
                    <span>{Math.max(4, Math.ceil((featuredBlog.plainDescription.length || 240) / 220))} min read</span>
                  </div>
                  <div>
                    <h2 className="font-[Manrope] text-3xl font-extrabold leading-tight tracking-[-0.04em] text-slate-900">
                      {featuredBlog.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-600">
                      {featuredBlog.plainSubtitle || featuredBlog.plainDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0ff] text-lg text-[#702ae1]">
                        <LuCircleUserRound />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{featuredBlog.writerName || 'Digital Editorial'}</p>
                        <p className="text-sm text-slate-500">{formatDate(featuredBlog.createdAt)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${featuredBlog._id}`)}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#702ae1]/10 text-xl text-[#702ae1] transition hover:bg-[#702ae1] hover:text-white"
                    >
                      <LuArrowRight />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] bg-[#eef0ff] px-8 text-center">
                <LuBookOpen className="text-5xl text-[#702ae1]" />
                <h2 className="mt-5 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
                  Waiting for the first story
                </h2>
                <p className="mt-3 max-w-md text-slate-600">
                  Publish a blog from the writer dashboard and this landing page will instantly showcase it here.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/writer')}
                  className="mt-6 rounded-full bg-[#702ae1] px-6 py-3 font-semibold text-white"
                >
                  Open writer dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
