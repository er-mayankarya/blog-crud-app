import React, { useMemo } from 'react'
import { blogCategories } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'

const Footer = ({ containerClassName = '' }) => {
  const { blogs, user, canAccessWriterDashboard, navigate } = useAppContext()

  const visibleCategories = useMemo(() => {
    const dynamicCategories = blogs
      .map((blog) => blog.category)
      .filter(Boolean)
      .filter((category, index, allCategories) => allCategories.indexOf(category) === index)

    return ['All', ...blogCategories.filter((category) => category !== 'All'), ...dynamicCategories].filter(
      (category, index, allCategories) => allCategories.indexOf(category) === index
    )
  }, [blogs])

  return (
    <footer id="site-footer" className="pb-10 pt-8">
      <div
        className={`grid gap-10 rounded-[2rem] bg-white/78 px-6 py-10 shadow-[0_20px_40px_rgba(39,46,66,0.05)] backdrop-blur-xl md:grid-cols-4 ${containerClassName}`}
      >
        <div>
          <p className="font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-slate-900">DigitalEthereal</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-600">
            A softer, sharper editorial space for technology, culture, and modern internet thinking.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Platform</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <button type="button" onClick={() => navigate('/')} className="block transition hover:text-[#702ae1]">Explore</button>
            <button type="button" onClick={() => navigate('/auth')} className="block transition hover:text-[#702ae1]">Account</button>
            <button type="button" onClick={() => navigate('/writers')} className="block transition hover:text-[#702ae1]">Writers</button>
            <button type="button" onClick={() => navigate('/writer')} className="block transition hover:text-[#702ae1]">Writer Hub</button>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Discover</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <button type="button" onClick={() => navigate('/#newsletter-section')} className="block transition hover:text-[#702ae1]">Newsletter</button>
            <button type="button" onClick={() => navigate('/#site-footer')} className="block transition hover:text-[#702ae1]">About</button>
            {visibleCategories.slice(0, 3).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => navigate('/#stories')}
                className="block transition hover:text-[#702ae1]"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Status</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>{blogs.length ? `${blogs.length} live stories in the feed` : 'Waiting for the first published story'}</p>
            <p>{user ? `Signed in as ${user.name}` : 'Reader account not connected'}</p>
            <p>{canAccessWriterDashboard ? 'Author dashboard available' : 'Author mode not active'}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
