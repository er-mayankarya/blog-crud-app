import express from 'express';
import auth from '../middleware/auth.js';
import {
    approveWriterCommentById,
    deleteWriterCommentById,
    getWriterBlogs,
    getWriterComments,
    getWriterDashboard,
    getPublicWriterDirectory,
    getWriterProfile,
    getPublicWriterProfile,
    loginWriter,
    registerWriter,
    resetWriterPassword,
    updateWriterPassword,
    verifyWriterResetIdentity
} from '../controllers/writerController.js';

const writerRouter = express.Router();

writerRouter.post('/register', registerWriter);
writerRouter.post('/login', loginWriter);
writerRouter.post('/verify-reset', verifyWriterResetIdentity);
writerRouter.post('/reset-password', resetWriterPassword);
writerRouter.get('/public', getPublicWriterDirectory);
writerRouter.get('/public/:username', getPublicWriterProfile);
writerRouter.get('/public/id/:writerId', getPublicWriterProfile);
writerRouter.get('/profile', auth, getWriterProfile);
writerRouter.post('/update-password', auth, updateWriterPassword);
writerRouter.get('/comments', auth, getWriterComments);
writerRouter.get('/blogs', auth, getWriterBlogs);
writerRouter.post('/delete-comment', auth, deleteWriterCommentById);
writerRouter.post('/approve-comment', auth, approveWriterCommentById);
writerRouter.get('/dashboard', auth, getWriterDashboard);

export default writerRouter;
