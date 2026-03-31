import React from 'react'
import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/useAppContext'

const WriterSidebar = ({ isOpen, setIsOpen }) => {
  const { logoutWriter, navigate } = useAppContext()

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 bg-[#101426]/35 backdrop-blur-sm transition md:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label='Close writer sidebar overlay'
      />

      <div className={`fixed left-0 top-0 z-40 flex h-[100dvh] w-[84%] max-w-[280px] flex-col border-r border-[#e7e6fb] bg-white/95 pt-6 shadow-[0_18px_40px_rgba(39,46,66,0.08)] backdrop-blur-xl transition-transform duration-300 md:static md:h-auto md:min-h-[calc(100vh-76px)] md:w-auto md:max-w-none md:flex-shrink-0 md:self-stretch md:translate-x-0 md:bg-white/82 md:shadow-[0_18px_40px_rgba(39,46,66,0.04)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className='mb-4 flex items-center justify-between px-4 md:hidden'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Writer menu</p>
        <button
          type='button'
          onClick={() => setIsOpen(false)}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f1ff] text-[#702ae1]'
          aria-label='Close writer sidebar'
        >
          <X className='h-5 w-5' />
        </button>
      </div>

      <NavLink end to='/writer' onClick={() => setIsOpen(false)} className={({ isActive }) =>`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] md:min-w-64 md:px-9 ${isActive && 'border-r-4 border-[#702ae1] bg-[#f3f1ff] text-[#702ae1] hover:bg-[#f3f1ff]'}`}>
        <img src={assets.home_icon} alt="" />
        <p>Writer Dashboard</p>
      </NavLink>

      <NavLink to='/writer/addBlog' onClick={() => setIsOpen(false)} className={({ isActive }) =>`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] md:min-w-64 md:px-9 ${isActive && 'border-r-4 border-[#702ae1] bg-[#f3f1ff] text-[#702ae1] hover:bg-[#f3f1ff]'}`}>
        <img src={assets.add_icon} alt="" />
        <p>Add blogs</p>
      </NavLink>

      <NavLink to='/writer/listBlog' onClick={() => setIsOpen(false)} className={({ isActive }) =>`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] md:min-w-64 md:px-9 ${isActive && 'border-r-4 border-[#702ae1] bg-[#f3f1ff] text-[#702ae1] hover:bg-[#f3f1ff]'}`}>
        <img src={assets.list_icon} alt="" />
        <p>Blog lists</p>
      </NavLink>

      <NavLink to='/writer/comments' onClick={() => setIsOpen(false)} className={({ isActive }) =>`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] md:min-w-64 md:px-9 ${isActive && 'border-r-4 border-[#702ae1] bg-[#f3f1ff] text-[#702ae1] hover:bg-[#f3f1ff]'}`}>
        <img src={assets.comment_icon} alt="" className='w-6' />
        <p>Comments</p>
      </NavLink>

       <NavLink to='/writer/profile' onClick={() => setIsOpen(false)} className={({ isActive }) =>`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-[#f3f1ff] md:min-w-64 md:px-9 ${isActive && 'border-r-4 border-[#702ae1] bg-[#f3f1ff] text-[#702ae1] hover:bg-[#f3f1ff]'}`}>
        <img src={assets.user_icon} alt="" className='w-5' />
        <p>Writer Profile</p>
      </NavLink>

      <button onClick={() => { logoutWriter(); navigate('/'); setIsOpen(false) }} className='mx-3 mb-6 mt-auto rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 md:mx-9'>
        Logout
      </button>
    </div>
    </>
  )
}

export default WriterSidebar
