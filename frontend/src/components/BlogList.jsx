import React, { useMemo, useState } from 'react'
import { blogCategories } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'
import BlogCard from './BlogCard'
import { normalizeBlog } from '../utils/homeDisplay'

const BlogList = ({ containerClassName = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const { blogs, input, setInput } = useAppContext()

  const normalizedBlogs = useMemo(() => blogs.map(normalizeBlog), [blogs])

  const visibleCategories = useMemo(() => {
    const dynamicCategories = normalizedBlogs
      .map((blog) => blog.category)
      .filter(Boolean)
      .filter((category, index, allCategories) => allCategories.indexOf(category) === index)

    return ['All', ...blogCategories.filter((category) => category !== 'All'), ...dynamicCategories].filter(
      (category, index, allCategories) => allCategories.indexOf(category) === index
    )
  }, [normalizedBlogs])

  const filteredBlogs = useMemo(() => {
    return normalizedBlogs.filter((blog) => {
      const matchesSearch =
        !input ||
        blog.title?.toLowerCase().includes(input.toLowerCase()) ||
        blog.category?.toLowerCase().includes(input.toLowerCase()) ||
        blog.plainDescription?.toLowerCase().includes(input.toLowerCase())

      const matchesCategory = activeCategory === 'All' || blog.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [activeCategory, input, normalizedBlogs])

  return (
    <>
      <section className="pb-4">
        <div className={`flex gap-3 overflow-x-auto pb-2 ${containerClassName}`}>
          {visibleCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-[#702ae1] text-white shadow-[0_20px_40px_rgba(112,42,225,0.2)]'
                  : 'bg-[#eef0ff] text-slate-600 hover:bg-[#dfe5ff]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <main id="stories" className="pb-20 pt-8">
        <div className={containerClassName}>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              
              <h2 className="mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-slate-900">
                View the latest stories from our writers
              </h2>
            </div>
          </div>

          {filteredBlogs.length ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredBlogs.slice(0, 9).map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-[#eef0ff] px-8 py-14 text-center">
              <h3 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
                No stories match that search yet
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Try another keyword or switch back to a broader topic. Your search is still wired into the existing blog data.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInput('')
                  setActiveCategory('All')
                }}
                className="mt-6 rounded-full bg-[#702ae1] px-6 py-3 font-semibold text-white"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default BlogList
