import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Blog from "./pages/Blog.jsx"
import Auth from "./pages/Auth.jsx"
import Profile from "./pages/Profile.jsx"
import Following from "./pages/Following.jsx"
import Writers from "./pages/Writers.jsx"
import WriterDetails from "./pages/WriterDetails.jsx"
import WriterLayout from "./pages/writer/WriterLayout.jsx"
import WriterDashboard from "./pages/writer/WriterDashboard.jsx"
import WriterAddBlog from "./pages/writer/WriterAddBlog.jsx"
import WriterListBlog from "./pages/writer/WriterListBlog.jsx"
import WriterComments from "./pages/writer/WriterComments.jsx"
import WriterProfile from "./pages/writer/WriterProfile.jsx"
import WriterAuth from "./components/writer/WriterAuth.jsx"
import {Toaster} from 'react-hot-toast'

import 'quill/dist/quill.snow.css'
import { useAppContext } from "./context/useAppContext.js"

function App() {

  const {writerToken} = useAppContext()
  

  return (
    <>
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/following" element={<Following />} />
        <Route path="/writers" element={<Writers />} />
        <Route path="/writers/:username" element={<WriterDetails />} />
        <Route path="/writers/id/:writerId" element={<WriterDetails />} />
        <Route path='/writer' element={writerToken ? <WriterLayout />: <WriterAuth/>}> 
        <Route index element={<WriterDashboard/>}/>
        <Route path='profile' element={<WriterProfile/>}/>
        <Route path='addBlog' element={<WriterAddBlog/>}/>
        <Route path='listBlog' element={<WriterListBlog/>}/>
        <Route path='comments' element={<WriterComments/>}/>

        </Route>
      </Routes>
      
    </div>
    </>
  )
}

export default App
