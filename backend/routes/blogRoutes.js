import express from 'express';
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, incrementBlogShare, toggleBlogEngagement, togglePublished } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import userAuth from '../middleware/userAuth.js';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'),auth, addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublished);
blogRouter.post('/add-comment', userAuth, addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/engagement/toggle', userAuth, toggleBlogEngagement);
blogRouter.post('/engagement/share', incrementBlogShare);
blogRouter.post('/generate',auth, generateContent);
export default blogRouter;
