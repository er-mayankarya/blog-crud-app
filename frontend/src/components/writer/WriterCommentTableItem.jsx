import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const WriterCommentTableItem = ({comment, fetchComments}) => {
  const {writerAxios} = useAppContext()
  const {blog, createdAt, _id} = comment;
  const commentDate = new Date(createdAt);

  const approveComment = async ()=>{
    try{
      const {data} = await writerAxios.post('/api/writer/approve-comment', {id: _id})
      if (data.success){
        toast.success(data.message)
        fetchComments()
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }
  }

  const deleteComment = async ()=>{
    try{
      const confirmDelete = window.confirm('Are you sure you want to delete this comment?')
      if(!confirmDelete) return;
      const {data} = await writerAxios.post('/api/writer/delete-comment', {id: _id})
      if (data.success){
        toast.success(data.message)
        fetchComments()
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }
  }

  return (
    <tr className='border-y border-[#ecebfa]'>
      <td className='px-6 py-4'>
        <b className='font-medium text-slate-700'>Blog</b>: {blog.title}
        <br />
        <br />
        <b className='font-medium text-slate-700'>Name</b>: {comment.name}
        <br />
        <b className='font-medium text-slate-700'>Comment</b>: {comment.content}
      </td>
      <td className='px-6 py-4 text-sm text-slate-500 max-sm:hidden'>
        {commentDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4'>
        <div className='inline-flex items-center gap-4'>
          {!comment.isApproved ? <img onClick={approveComment} src={assets.tick_icon} alt="" className='w-5 cursor-pointer transition-all hover:scale-110' /> : <p className='rounded-full border border-[#86efac] bg-[#dcfce7] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#15803d]'>Approved</p>}
          <img onClick={deleteComment} src={assets.bin_icon} alt="" className='w-5 hover:scale-110 transition-all cursor-pointer' />
        </div>
      </td>
    </tr>
  )
}

export default WriterCommentTableItem
