import React, { useEffect, useState } from 'react'
import { LuArrowRight, LuHeartHandshake, LuUserRound } from 'react-icons/lu'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/useAppContext'

const Following = () => {
  const { userToken, userProfile, fetchUserProfile, navigate } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userToken) {
      navigate('/auth', { state: { from: '/following' } })
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

  return (
    <div className="ethereal-shell min-h-screen bg-[#f6f6ff]">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <section className="rounded-[2.5rem] bg-white/78 p-8 shadow-[0_24px_70px_rgba(39,46,66,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f1ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#702ae1]">
                <LuHeartHandshake className="h-4 w-4" />
                Following
              </div>
              <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                Writers you follow
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Keep up with the authors whose ideas, essays, and blog stories you want to revisit.
              </p>
            </div>
            <div className="rounded-full bg-[#eef0ff] px-5 py-3 text-sm font-semibold text-slate-600">
              {userProfile?.followingWriters?.length || 0} followed writers
            </div>
          </div>
        </section>

        <section className="mt-10">
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader />
            </div>
          ) : userProfile?.followingWriters?.length ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {userProfile.followingWriters.map((writer) => (
                <button
                  key={writer._id}
                  type="button"
                  onClick={() => navigate(`/writers/${writer.username}`)}
                  className="rounded-[2rem] bg-white/80 p-6 text-left shadow-[0_20px_40px_rgba(39,46,66,0.06)] transition hover:-translate-y-1"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#702ae1,#57d2d0)] p-1">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#702ae1]">
                      <LuUserRound className="h-8 w-8" />
                    </div>
                  </div>
                  <h2 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900">
                    {writer.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#702ae1]">@{writer.username}</p>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{writer.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#702ae1]">
                    View writer page
                    <LuArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white/75 p-10 text-center shadow-[0_20px_40px_rgba(39,46,66,0.05)]">
              <p className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-slate-900">No followed writers yet</p>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Follow writers from any blog post or writer page and they will show up here.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Following
