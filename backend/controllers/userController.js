import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
    const [salt, originalHash] = storedPassword.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
};

const isAuthorAccount = (user) => user?.accountType === 'author';

const createUserToken = (user) => jwt.sign(
    {
        userId: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        username: user.username || null,
        accountType: user.accountType,
        isAuthor: isAuthorAccount(user)
    },
    process.env.JWT_SECRET
);

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    accountType: user.accountType,
    isAuthor: isAuthorAccount(user),
    username: user.username || null,
    description: user.description || '',
    authorSince: user.authorSince || null,
    savedBlogs: user.savedBlogs,
    likedBlogs: user.likedBlogs,
    dislikedBlogs: user.dislikedBlogs,
    followingWriters: user.followingWriters,
    createdAt: user.createdAt
});

const buildBlogSummary = async (blogIds) => {
    if (!blogIds?.length) return [];

    const blogs = await Blog.find({ _id: { $in: blogIds }, isPublished: true }).lean();
    const blogMap = blogs.reduce((acc, blog) => {
        acc[blog._id.toString()] = blog;
        return acc;
    }, {});

    return blogIds
        .map((blogId) => blogMap[blogId.toString()])
        .filter(Boolean);
};

const buildProfilePayload = async (user) => {
    const [likedBlogs, savedBlogs, comments, followingWriters] = await Promise.all([
        buildBlogSummary(user.likedBlogs),
        buildBlogSummary(user.savedBlogs),
        Comment.find({ user: user._id })
            .populate({
                path: 'blog',
                match: { isPublished: true }
            })
            .sort({ createdAt: -1 })
            .lean(),
        User.find({ _id: { $in: user.followingWriters || [] }, accountType: 'author' })
            .select('name username description createdAt accountType authorSince')
            .lean()
    ]);

    return {
        user: sanitizeUser(user),
        likedBlogs,
        savedBlogs,
        followingWriters,
        comments: comments
            .filter((comment) => comment.blog)
            .map((comment) => ({
                _id: comment._id,
                content: comment.content,
                isApproved: comment.isApproved,
                createdAt: comment.createdAt,
                blog: comment.blog
            }))
    };
};

export const signupUser = async (req, res) => {
    try {
        const { name, username, email, mobile, password } = req.body;

        if (!name || !username || !email || !mobile || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedMobile = mobile.trim();
        const normalizedUsername = username.trim().toLowerCase();
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { mobile: normalizedMobile }, { username: normalizedUsername }]
        });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists with this email, mobile number, or username" });
        }

        const user = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            mobile: normalizedMobile,
            password: hashPassword(password)
        });

        const token = createUserToken(user);

        res.json({
            success: true,
            message: "Account created successfully",
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { login, email, password } = req.body;
        const loginValue = login || email;

        if (!loginValue || !password) {
            return res.json({ success: false, message: "Email, username, or mobile number and password are required" });
        }

        const trimmedLogin = loginValue.trim();
        const normalizedLogin = trimmedLogin.toLowerCase();
        const user = await User.findOne({
            $or: [
                { email: normalizedLogin },
                { username: normalizedLogin },
                { mobile: trimmedLogin }
            ]
        });

        if (!user || !verifyPassword(password, user.password)) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createUserToken(user);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const profile = await buildProfilePayload(user);
        res.json({ success: true, profile });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Current password and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.json({ success: false, message: "New password must be at least 6 characters long" });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!verifyPassword(currentPassword, user.password)) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        user.password = hashPassword(newPassword);
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const verifyResetEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.json({ success: false, message: "No account found for this email" });
        }

        res.json({ success: true, message: "Email verified" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const resetForgottenPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.json({ success: false, message: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.json({ success: false, message: "No account found for this email" });
        }

        user.password = hashPassword(newPassword);
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const toggleFollowWriter = async (req, res) => {
    try {
        const { writerId } = req.body;

        if (!writerId) {
            return res.json({ success: false, message: 'Writer is required' });
        }

        const [user, writer] = await Promise.all([
            User.findById(req.user.userId),
            User.findOne({ _id: writerId, accountType: 'author' })
        ]);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!writer) {
            return res.json({ success: false, message: 'Writer not found' });
        }

        const writerIdString = writer._id.toString();
        const isFollowing = user.followingWriters.some((followedWriterId) => followedWriterId.toString() === writerIdString);

        user.followingWriters = isFollowing
            ? user.followingWriters.filter((followedWriterId) => followedWriterId.toString() !== writerIdString)
            : [...user.followingWriters, writer._id];

        await user.save();

        res.json({
            success: true,
            message: isFollowing ? 'Writer unfollowed successfully' : 'Writer followed successfully',
            user: {
                accountType: user.accountType,
                isAuthor: isAuthorAccount(user),
                username: user.username || null,
                description: user.description || '',
                authorSince: user.authorSince || null,
                followingWriters: user.followingWriters,
                savedBlogs: user.savedBlogs,
                likedBlogs: user.likedBlogs,
                dislikedBlogs: user.dislikedBlogs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const becomeAuthor = async (req, res) => {
    try {
        const { description, consent } = req.body;

        if (!consent) {
            return res.json({ success: false, message: 'You must consent before becoming an author' });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const normalizedUsername = (user.username || '').trim().toLowerCase();

        if (!normalizedUsername) {
            return res.json({ success: false, message: 'Username is required' });
        }

        const existingAuthor = await User.findOne({
            _id: { $ne: req.user.userId },
            username: normalizedUsername
        });

        if (existingAuthor) {
            return res.json({ success: false, message: 'Username is already taken' });
        }

        user.accountType = 'author';
        user.username = normalizedUsername;
        user.description = description?.trim() || '';
        user.authorSince = user.authorSince || new Date();
        await user.save();

        const token = createUserToken(user);

        res.json({
            success: true,
            message: 'Author profile created successfully',
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
