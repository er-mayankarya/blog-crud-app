import React, {useEffect, useState, useCallback} from 'react'
import WriterBlogTableItem from '../../components/writer/WriterBlogTableItem'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterListBlog = () => {
  const {writerAxios} = useAppContext()
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = useCallback(async () => {
    try{
      const {data} = await writerAxios.get('/api/writer/blogs')
      if(data.success){
        setBlogs(data.blogs)
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }
  }, [writerAxios])

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs])

  return (
    <div className='min-w-0 flex-1 bg-[#f6f6ff] px-5 pt-5 sm:pl-16 sm:pt-12'>
      <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Publishing desk</p>
      <h1 className='mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900'>Your blogs</h1>
      <div className='relative mt-6 max-w-4xl overflow-x-auto rounded-[1.75rem] bg-white/85 shadow-[0_20px_50px_rgba(39,46,66,0.06)] scrollbar-hide'>
        <table className='w-full text-sm text-slate-600'>
          <thead className='text-left text-[11px] uppercase tracking-[0.18em] text-slate-400'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4'> Blog Title</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Date</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Status</th>
              <th scope='col' className='px-2 py-4'> Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index)=>(
              <WriterBlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index+1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WriterListBlog
