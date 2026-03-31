import React, { useEffect, useState } from 'react'
import { LuArrowRight, LuBookOpen, LuSearch, LuSparkles, LuUsers } from 'react-icons/lu'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/useAppContext'

const Writers = () => {
  const { api, navigate } = useAppContext()
  const [writers, setWriters] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setIsLoading(true)
        const query = searchValue.trim() ? `?q=${encodeURIComponent(searchValue.trim())}` : ''
        const { data } = await api.get(`/api/writer/public${query}`)

        if (!data.success) {
          throw new Error(data.message)
        }

        setWriters(data.writers)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = window.setTimeout(fetchWriters, searchValue.trim() ? 250 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [api, searchValue])

  return (
    <div className="ethereal-shell min-h-screen overflow-x-hidden bg-[#f6f6ff]">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full px-4 pb-10 pt-8 sm:px-6 lg:px-10">
        <section className="overflow-hidden rounded-[2.5rem] bg-white/75 p-6 shadow-[0_24px_70px_rgba(39,46,66,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
             
              <h1 className="mt-5 max-w-3xl font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-6xl">
                Explore every voice shaping the platform.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Browse thoughtful creators, discover their latest stories, and jump into the writers you want to follow most.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(112,42,225,0.95),rgba(87,210,208,0.9))] p-6 text-white shadow-[0_24px_60px_rgba(112,42,225,0.22)] sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-extrabold">{writers.length}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/75">Writers listed</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold">{writers.reduce((total, writer) => total + (writer.stats?.blogs || 0), 0)}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/75">Published stories</p>
                </div>
              </div>

              <label className="mt-8 block">
                <span className="mb-3 block text-sm font-semibold text-white/85">Search writers</span>
                <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-4 backdrop-blur">
                  <LuSearch className="h-5 w-5 text-white/80" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Name, username, or niche"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55"
                  />
                </div>
              </label>
            </div>
          </div>
        </section>

        <section className="pt-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-slate-900">Writer Directory</h2>
              <p className="mt-2 text-sm text-slate-500">
                {searchValue.trim() ? `Results for "${searchValue.trim()}"` : 'All writers on the platform'}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_12px_30px_rgba(39,46,66,0.06)] sm:inline-flex">
              <LuUsers className="h-4 w-4 text-[#702ae1]" />
              Discover and follow
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader />
            </div>
          ) : writers.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {writers.map((writer) => (
                <article
                  key={writer._id}
                  className="rounded-[2rem] bg-white/82 p-6 shadow-[0_20px_40px_rgba(39,46,66,0.06)] backdrop-blur-xl transition hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#702ae1,#57d2d0)] p-1 shadow-[0_18px_40px_rgba(112,42,225,0.2)]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl font-extrabold text-[#702ae1]">
                        {writer.name?.charAt(0)?.toUpperCase() || 'W'}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-full bg-[#702ae1]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#702ae1]">
                        Writer
                      </span>
                      <h3 className="mt-3 truncate font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900">
                        {writer.name}
                      </h3>
                      <p className="mt-1 truncate text-sm font-semibold text-[#702ae1]">@{writer.username}</p>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600">
                    {writer.description}
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3 rounded-[1.5rem] bg-[#f8f7ff] p-4">
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">{writer.stats?.followers || 0}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Followers</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">{writer.stats?.blogs || 0}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Blogs</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">{writer.stats?.reads || 0}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Reads</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/writers/${writer.username}`)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(112,42,225,0.18)] transition hover:-translate-y-0.5"
                  >
                    View profile
                    <LuArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white/75 p-10 text-center shadow-[0_20px_40px_rgba(39,46,66,0.05)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#702ae1]/10 text-[#702ae1]">
                <LuBookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900">
                No writers matched your search
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Try a different name, username, or topic and we will surface the closest writer profiles.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Writers
