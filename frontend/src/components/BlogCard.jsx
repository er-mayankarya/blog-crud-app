import React from 'react'
import { LuArrowRight, LuMessageCircle, LuTrendingUp } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import BlogEngagement from './BlogEngagement'
import { formatDate, normalizeBlog } from '../utils/homeDisplay'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()
  const normalizedBlog = normalizeBlog(blog)

  return (
    <article
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="group cursor-pointer rounded-[2rem] bg-white/85 p-5 shadow-[0_20px_40px_rgba(39,46,66,0.06)] transition hover:-translate-y-1"
    >
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <img
          src={blog.image}
          alt={blog.title}
          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <span className="glass-panel rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
            {blog.category || 'Editorial'}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-1 pb-1 pt-5">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>{formatDate(blog.createdAt)}</span>
          <span className="truncate">{blog.writerName || 'Digital Editorial'}</span>
        </div>

        <div>
          <h3 className="font-[Manrope] text-2xl font-extrabold leading-tight tracking-[-0.04em] text-slate-900 transition group-hover:text-[#702ae1]">
            {blog.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {normalizedBlog.plainSubtitle || normalizedBlog.plainDescription}
          </p>
        </div>

       
        <BlogEngagement blog={blog} compact className="pt-2" />
      </div>
    </article>
  )
}

export default BlogCard
