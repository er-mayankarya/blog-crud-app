import React, {useState, useEffect, useCallback} from 'react'
import { assets } from '../../assets/assets'
import WriterBlogTableItem from '../../components/writer/WriterBlogTableItem'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterDashboard = () => {
  const {writerAxios} = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })

  const fetchDashboard = useCallback(async () => {
    try{
      const {data} = await writerAxios.get('/api/writer/dashboard')
      data.success ? setDashboardData(data.dashboardData) : toast.error(data.message);
    }catch (error){
      toast.error(error.message)
    }
  }, [writerAxios])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return (
    <div className='min-w-0 flex-1 bg-[#f6f6ff] p-4 md:p-10'>
      <div className='mb-8'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Overview</p>
        <h1 className='mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900'>Writer dashboard</h1>
      </div>

      <div className='flex flex-wrap gap-4'>
        <div className='min-w-58 flex cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white/85 p-5 shadow-[0_18px_40px_rgba(39,46,66,0.05)] transition hover:-translate-y-1'>
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className='text-2xl font-extrabold text-slate-900'>{dashboardData.blogs}</p>
            <p className='text-sm font-medium text-slate-500'>Your blogs</p>
          </div>
        </div>

        <div className='min-w-58 flex cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white/85 p-5 shadow-[0_18px_40px_rgba(39,46,66,0.05)] transition hover:-translate-y-1'>
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className='text-2xl font-extrabold text-slate-900'>{dashboardData.comments}</p>
            <p className='text-sm font-medium text-slate-500'>Comments on your blogs</p>
          </div>
        </div>

        <div className='min-w-58 flex cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white/85 p-5 shadow-[0_18px_40px_rgba(39,46,66,0.05)] transition hover:-translate-y-1'>
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className='text-2xl font-extrabold text-slate-900'>{dashboardData.drafts}</p>
            <p className='text-sm font-medium text-slate-500'>Drafts</p>
          </div>
        </div>
      </div>

      <div className='mt-10'>
        <div className='mb-4 flex items-center gap-3 text-slate-700'>
          <img src={assets.dashboard_icon_4} alt="" />
          <p className='font-[Manrope] text-2xl font-extrabold tracking-[-0.04em]'>Your latest blogs</p>
        </div>
        <div className='relative max-w-4xl overflow-x-auto rounded-[1.75rem] bg-white/85 shadow-[0_20px_50px_rgba(39,46,66,0.06)] scrollbar-hide'>
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
              {dashboardData.recentBlogs.map((blog, index)=>(
                <WriterBlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index+1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WriterDashboard
