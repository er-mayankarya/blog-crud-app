import React, {useEffect, useRef, useState} from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterAddBlog = () => {
  const {writerAxios} = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    try{
      e.preventDefault()
      setIsAdding(true)
      const blog ={
        title,
        subTitle,
        description : quillRef.current.root.innerHTML,
        category,
        isPublished
      }
      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)
      const {data} = await writerAxios.post(`/api/blog/add`,formData)
      if(data.success){
        toast.success(data.message);
        setImage(false)
        setTitle('')
        setSubTitle('')
        quillRef.current.root.innerHTML = ''
        setCategory('Select category')
      }else{
        toast.error(data.message)
      }
    }catch (error){
      toast.error(error.message)
    }finally{
      setIsAdding(false)
    }
  }

  const generateContent = async () => {
    try {
      setLoading(true)
      const currentContent = quillRef.current.root.innerHTML;
      if (!currentContent || currentContent.trim() === '<p><br></p>' || currentContent.trim() === '') {
        toast.error('Please write some content first to generate AI content');
        return;
      }
      toast.loading('Generating content with AI...');
      const {data} = await writerAxios.post('/api/blog/generate', {
        currentContent: quillRef.current.getText(),
        title: title,
        category: category
      });
      if (data.success) {
        const currentHTML = quillRef.current.root.innerHTML;
        const newContent = currentHTML + '<p>' + data.generatedContent + '</p>';
        quillRef.current.root.innerHTML = newContent;
        toast.dismiss();
        toast.success(data.message || 'AI content generated successfully!');
      } else {
        toast.dismiss();
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {theme: 'snow'})
    }
  },[])

  return (
    <div className='min-w-0 flex-1 overflow-x-hidden bg-[#f6f6ff] p-4 text-slate-600 md:p-10'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-3xl rounded-[2rem] bg-white/85 p-4 shadow-[0_20px_50px_rgba(39,46,66,0.06)] md:p-10'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#8d88b5]'>Create story</p>
        <h1 className='mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-slate-900'>Add a new blog</h1>

        <p className='mt-8 text-sm font-semibold text-slate-700'>Upload thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-3 h-16 rounded-2xl cursor-pointer' />
          <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' required hidden/>
        </label>
        <p className='mt-5 text-sm font-semibold text-slate-700'>Blog title</p>
        <input type="text" placeholder='Type here' required className='mt-2 w-full max-w-lg rounded-2xl border border-[#dddff2] bg-[#f7f8ff] p-3 outline-none transition focus:border-[#b28cff]' onChange={(e)=>setTitle(e.target.value)} value={title}/>
        <p className='mt-5 text-sm font-semibold text-slate-700'>Sub title</p>
        <input type="text" placeholder='Type here' required className='mt-2 w-full max-w-lg rounded-2xl border border-[#dddff2] bg-[#f7f8ff] p-3 outline-none transition focus:border-[#b28cff]' onChange={(e)=>setSubTitle(e.target.value)} value={subTitle}/>
        <p className='mt-5 text-sm font-semibold text-slate-700'>Blog Description</p>
        <div className='relative max-w-lg pb-16 pt-2 sm:pb-10'>
          <div ref={editorRef}></div>
          <button disabled={loading} className='absolute bottom-1 right-2 ml-2 cursor-pointer rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(112,42,225,0.18)]' type='button' onClick={generateContent} >Generate with AI</button>
        </div>
        <p className='mt-5 text-sm font-semibold text-slate-700'>Blog category</p>
        <select onChange={(e)=> setCategory(e.target.value)} name="category" value={category} className='mt-2 rounded-2xl border border-[#dddff2] bg-[#f7f8ff] px-3 py-3 text-sm text-slate-600 outline-none'>
          <option value="">Select category</option>
          {blogCategories.map((item, index)=> <option key={index} value={item}>{item}</option>)}
        </select>
        <div className='mt-5 flex gap-2'>
          <p className='text-sm font-semibold text-slate-700'>Publish Now</p>
          <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={(e)=> setIsPublished(e.target.checked)}/>
        </div>
        <div>
          <button disabled={isAdding} type='submit' className='mt-8 h-11 w-40 cursor-pointer rounded-full bg-[linear-gradient(135deg,#702ae1,#b28cff)] text-sm font-bold text-white shadow-[0_18px_34px_rgba(112,42,225,0.2)]'>{isAdding ? 'Adding...': 'Add Blog'}</button>
        </div>
      </form>
    </div>
  )
}

export default WriterAddBlog
