import React, {useState, useEffect, useCallback} from 'react'
import WriterCommentTableItem from '../../components/writer/WriterCommentTableItem'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterComments = () => {
  const { writerAxios } = useAppContext()
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('Not Approved')

  const fetchComments = useCallback(async () => {
    try {
      const {data} = await writerAxios.get('/api/writer/comments')
      data.success ? setComments(data.comments) : toast.error(data.message)
    }catch (error){
      toast.error(error.message)
    }
  }, [writerAxios])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <div className='min-w-0 flex-1 bg-[#f6f6ff] px-5 pt-5 sm:pl-16 sm:pt-12'>
      <div className='flex max-w-3xl flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Community</p>
          <h1 className='mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900'>Comments on your blogs</h1>
        </div>
        <div className='flex gap-4'>
          <button onClick={()=>setFilter('Approved')} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${filter === 'Approved' ? 'border-[#702ae1] bg-[#f3f1ff] text-[#702ae1]': 'border-[#dddff2] bg-white text-slate-600'}`}>Approved</button>
          <button onClick={()=>setFilter('Not Approved')} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${filter === 'Not Approved' ? 'border-[#702ae1] bg-[#f3f1ff] text-[#702ae1]': 'border-[#dddff2] bg-white text-slate-600'}`}>Not Approved</button>
        </div>
      </div>

      <div className='relative mt-6 max-w-3xl overflow-x-auto rounded-[1.75rem] bg-white/85 shadow-[0_20px_50px_rgba(39,46,66,0.06)] scrollbar-hide'>
        <table className='w-full text-sm text-slate-600 '>
          <thead className='text-left text-[11px] uppercase tracking-[0.18em] text-slate-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.filter((comment)=>{
              if(filter === 'Approved') return comment.isApproved === true
              return comment.isApproved === false
            }).map((comment)=> <WriterCommentTableItem key={comment._id} comment={comment} fetchComments={fetchComments} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WriterComments
