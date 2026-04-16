import express from 'express';
import {
    becomeAuthor,
    getCurrentUser,
    getUserProfile,
    loginUser,
    resetForgottenPassword,
    signupUser,
    toggleFollowWriter,
    updateUserPassword,
    verifyResetEmail
} from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify-reset-email', verifyResetEmail);
userRouter.post('/reset-password', resetForgottenPassword);
userRouter.get('/me', userAuth, getCurrentUser);
userRouter.get('/profile', userAuth, getUserProfile);
userRouter.post('/update-password', userAuth, updateUserPassword);
userRouter.post('/become-author', userAuth, becomeAuthor);
userRouter.post('/follow-writer', userAuth, toggleFollowWriter);

export default userRouter;
