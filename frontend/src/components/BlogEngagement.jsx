import React from 'react'
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { LuMessageCircleMore, LuShare2 } from 'react-icons/lu'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

const BlogEngagement = ({ blog, onBlogUpdate, onCommentClick, compact = false, showShare = true, className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userToken, blogReactions, bookmarkedBlogIds, toggleReaction, toggleBookmark, incrementShare } = useAppContext()

  const currentReaction = blogReactions[blog._id] || null
  const isBookmarked = bookmarkedBlogIds.includes(blog._id)

  const syncUpdatedBlog = (updatedBlog) => {
    if (updatedBlog && onBlogUpdate) {
      onBlogUpdate(updatedBlog)
    }
  }

  const redirectToAuth = () => {
    toast.error('Please login to interact with blogs')
    navigate('/auth', { state: { from: location.pathname } })
  }

  const handleReaction = async (event, reaction) => {
    event.stopPropagation()

    if (!userToken) {
      redirectToAuth()
      return
    }

    try {
      const updatedBlog = await toggleReaction(blog._id, reaction)
      syncUpdatedBlog(updatedBlog)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleBookmark = async (event) => {
    event.stopPropagation()

    if (!userToken) {
      redirectToAuth()
      return
    }

    try {
      const updatedBlog = await toggleBookmark(blog._id)
      syncUpdatedBlog(updatedBlog)
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleComment = (event) => {
    event.stopPropagation()

    if (onCommentClick) {
      onCommentClick()
      return
    }

    navigate(`/blog/${blog._id}`)
  }

  const handleShare = async (event) => {
    event.stopPropagation()

    const shareUrl = `${window.location.origin}/blog/${blog._id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.subTitle,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Blog link copied to clipboard')
      }

      const updatedBlog = await incrementShare(blog._id)
      syncUpdatedBlog(updatedBlog)
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error(error.message || 'Unable to share this blog')
      }
    }
  }

  const baseButtonClass = compact
    ? 'inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-gray-500 transition hover:border-primary/40 hover:text-primary'
    : 'inline-flex items-center gap-2 rounded-full border border-gray-200 px-3.5 py-2 text-sm text-gray-600 transition hover:border-primary/40 hover:text-primary'

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={(event) => handleReaction(event, 'like')} className={baseButtonClass}>
        {currentReaction === 'like' ? <BiSolidLike className="text-primary" /> : <BiLike />}
        <span>{blog.likesCount || 0}</span>
      </button>

      <button type="button" onClick={(event) => handleReaction(event, 'dislike')} className={baseButtonClass}>
        {currentReaction === 'dislike' ? <BiSolidDislike className="text-primary" /> : <BiDislike />}
        <span>{blog.dislikesCount || 0}</span>
      </button>

      <button type="button" onClick={handleComment} className={baseButtonClass}>
        <LuMessageCircleMore />
        <span>{blog.commentsCount || 0}</span>
      </button>

      {showShare && (
        <button type="button" onClick={handleShare} className={baseButtonClass}>
          <LuShare2 />
          <span>{blog.sharesCount || 0}</span>
        </button>
      )}

      <button type="button" onClick={handleBookmark} className={baseButtonClass}>
        {isBookmarked ? <FaBookmark className="text-primary" /> : <FaRegBookmark />}
        <span>{blog.bookmarksCount || 0}</span>
      </button>
    </div>
  )
}

export default BlogEngagement
