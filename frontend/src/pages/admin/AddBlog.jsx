
import React, {useEffect, useRef, useState} from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddBlog = () => {

    const {axios} = useAppContext()
    const [isAdding, setIsAdding] = useState(false)

    const editorRef = useRef(null)
    const quillRef = useRef(null)



    const [image, setImage] = useState(false)
    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [category, setCategory] = useState('Startup')
    const [isPublished, setIsPublishde] = useState(false)
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

            const {data} = await axios.post(`/api/blog/add`,formData)

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

        const {data} = await axios.post('/api/blog/generate', {
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
   <form onSubmit={onSubmitHandler} className='flex bg-blue-50/50 text-gray-600 h-[950px] w-[100vw] overflow-scroll'>
    <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Upload thumbnail</p>
        <label htmlFor="image">
            <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
            <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' required hidden/>
        </label>

        <p className='mt-4'>Blog title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e)=>setTitle(e.target.value)} value={title}/>

        <p className='mt-4'>Sub title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e)=>setSubTitle(e.target.value)} value={subTitle}/>

        <p className='mt-4'>Block Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
            <div ref={editorRef}></div>
            
            <button disabled={loading} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer' type='button' onClick={generateContent} >Generate with AI</button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select onChange={(e)=> setCategory(e.target.value)} name="category" id="" value={category} className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
            <option value="">Select category</option>
            {blogCategories.map((item, index)=>{
                return <option key={index} value={item}>{item}</option>

            })}
        </select>

        <div className='flex gap-2 mt-4'> 
            <p>Publish Now</p>
            <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={(e)=> setIsPublishde(e.target.checked)}/>
        </div>

        <div>
            <button disabled={isAdding} type='submit' className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>{isAdding ? 'Adding...': 'Add Blog'}</button>
        </div>

    </div>

   </form>
  )
}

export default AddBlog
