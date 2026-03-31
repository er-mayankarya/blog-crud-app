import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const WriterBlogTableItem = ({blog, index, fetchBlogs}) => {
  const {writerAxios} = useAppContext()
  const {title, createdAt} = blog;
  const blogDate = new Date(createdAt);

  const deleteBlog = async ()=>{
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?')
    if(!confirmDelete){
      return
    }
    try{
      const {data} = await writerAxios.post('/api/blog/delete',{id: blog._id})
      if(data.success){
        toast.success(data.message)
        await fetchBlogs()
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }
  }

  const togglePublish = async ()=>{
    try{
      const {data} = await writerAxios.post('/api/blog/toggle-publish',{id: blog._id})
      if(data.success){
        toast.success(data.message)
        await fetchBlogs()
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }
  }

  return (
    <tr className='border-y border-[#ecebfa]'>
      <th className='px-2 py-4 text-sm font-semibold text-slate-500'>{index}</th>
      <td className='px-2 py-4 font-medium text-slate-800'>{title}</td>
      <td className='px-2 py-4 text-sm text-slate-500 max-sm:hidden'>{blogDate.toDateString()}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${blog.isPublished? "bg-[#dcfce7] text-[#15803d]":"bg-[#fef3c7] text-[#b45309]"}`}>{blog.isPublished ? 'Published': 'Unpublished'}</p>
      </td>
      <td className='flex gap-3 px-2 py-4 text-xs'>
        <button onClick={togglePublish} className='mt-1 cursor-pointer rounded-full border border-[#d9daf1] bg-[#f7f8ff] px-3 py-1 font-semibold text-slate-700 transition hover:border-[#b28cff] hover:text-[#702ae1]'>{blog.isPublished ? 'Unpublish': 'Publish'}</button>
        <img onClick={deleteBlog} src={assets.cross_icon} alt="" className='w-8 hover:scale-110 transition-all cursor-pointer'/>
      </td>
    </tr>
  )
}

export default WriterBlogTableItem
