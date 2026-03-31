import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import WriterSidebar from '../../components/writer/WriterSidebar'
import { useAppContext } from '../../context/useAppContext'

const WriterLayout = () => {
  const { writer, navigate } = useAppContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <>
      <div className='flex h-[76px] items-center justify-between border-b border-[#e7e6fb] bg-white/90 px-4 py-2 backdrop-blur sm:px-12'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setIsSidebarOpen(true)}
            className='flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f1ff] text-[#702ae1] md:hidden'
            aria-label='Open writer sidebar'
          >
            <Menu className='h-5 w-5' />
          </button>
        <span onClick={()=>navigate('/')} className='cursor-pointer'>
        <span className='md:text-2xl font-bold text-black'>Digital</span> <span className='md:text-2xl font-bold text-[#702ae1] italic'>Ethereal</span>
        </span>
        </div>
        <div className='text-right'>
          <p className='text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Writer workspace</p>
          <p className='text-sm font-semibold text-slate-800'>{writer?.name || 'Writer'}</p>
        </div>
      </div>

      <div className='flex min-h-[calc(100vh-76px)] bg-[#f6f6ff]'>
        <WriterSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className='min-w-0 flex-1'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default WriterLayout
