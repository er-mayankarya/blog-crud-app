export const stripHtml = (value = '') => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const formatDate = (value) => {
  if (!value) return 'Freshly published'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

export const normalizeBlog = (blog) => ({
  ...blog,
  plainDescription: stripHtml(blog.description),
  plainSubtitle: stripHtml(blog.subTitle)
})

export const getBlogScore = (blog) =>
  (blog.likesCount || 0) * 3 + (blog.commentsCount || 0) * 2 + (blog.sharesCount || 0)

export const getFeaturedBlog = (blogs) => {
  if (!blogs.length) return null

  return [...blogs].sort((first, second) => getBlogScore(second) - getBlogScore(first))[0]
}
