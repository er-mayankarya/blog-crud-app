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

const createWriterToken = (writer) => jwt.sign(
    {
        userId: writer._id,
        writerId: writer._id,
        name: writer.name,
        username: writer.username || null,
        email: writer.email,
        mobile: writer.mobile,
        accountType: writer.accountType,
        isAuthor: isAuthorAccount(writer)
    },
    process.env.JWT_SECRET
);

const sanitizeWriter = (writer) => ({
    _id: writer._id,
    name: writer.name,
    username: writer.username || null,
    email: writer.email,
    phone: writer.mobile,
    mobile: writer.mobile,
    description: writer.description || '',
    accountType: writer.accountType,
    isAuthor: isAuthorAccount(writer),
    authorSince: writer.authorSince || null,
    createdAt: writer.createdAt
});

export const registerWriter = async (req, res) => {
    try {
        const { name, username, email, phone, description, password } = req.body;

        if (!name || !username || !email || !phone || !description || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();
        const normalizedUsername = username.trim().toLowerCase();

        const existingWriter = await User.findOne({
            $or: [{ email: normalizedEmail }, { mobile: normalizedPhone }, { username: normalizedUsername }]
        });

        if (existingWriter) {
            return res.json({ success: false, message: "Writer already exists with this email, phone, or username" });
        }

        const writer = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            mobile: normalizedPhone,
            description: description.trim(),
            accountType: 'author',
            authorSince: new Date(),
            password: hashPassword(password)
        });

        const token = createWriterToken(writer);

        res.json({
            success: true,
            message: "Writer account created successfully",
            token,
            writer: sanitizeWriter(writer)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const loginWriter = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.json({ success: false, message: "Email, phone, or username and password are required" });
        }

        const normalizedLogin = login.trim().toLowerCase();
        const writer = await User.findOne({
            accountType: 'author',
            $or: [
                { email: normalizedLogin },
                { mobile: login.trim() },
                { username: normalizedLogin }
            ]
        });

        if (!writer || !verifyPassword(password, writer.password)) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createWriterToken(writer);

        res.json({
            success: true,
            message: "Writer login successful",
            token,
            writer: sanitizeWriter(writer)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getWriterProfile = async (req, res) => {
    try {
        const writer = await User.findOne({ _id: req.writer.writerId, accountType: 'author' }).select('-password');

        if (!writer) {
            return res.status(404).json({ success: false, message: "Writer not found" });
        }

        const writerBlogs = await Blog.find({ writer: writer._id }).sort({ createdAt: -1 }).lean();
        const writerBlogIds = writerBlogs.map((blog) => blog._id);
        const comments = await Comment.find({ blog: { $in: writerBlogIds } })
            .populate('blog')
            .sort({ createdAt: -1 })
            .lean();

        const profile = {
            writer: sanitizeWriter(writer),
            blogs: writerBlogs,
            comments: comments.filter((comment) => comment.blog)
        };

        res.json({ success: true, profile });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateWriterPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Current password and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.json({ success: false, message: "New password must be at least 6 characters long" });
        }

        const writer = await User.findOne({ _id: req.writer.writerId, accountType: 'author' });

        if (!writer) {
            return res.status(404).json({ success: false, message: "Writer not found" });
        }

        if (!verifyPassword(currentPassword, writer.password)) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        writer.password = hashPassword(newPassword);
        await writer.save();

        res.json({ success: true, message: "Writer password updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const verifyWriterResetIdentity = async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return res.json({ success: false, message: "Email and phone are required" });
        }

        const writer = await User.findOne({
            accountType: 'author',
            email: email.trim().toLowerCase(),
            mobile: phone.trim()
        });

        if (!writer) {
            return res.json({ success: false, message: "No writer found with this email and phone" });
        }

        res.json({ success: true, message: "Writer verified successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const resetWriterPassword = async (req, res) => {
    try {
        const { email, phone, newPassword } = req.body;

        if (!email || !phone || !newPassword) {
            return res.json({ success: false, message: "Email, phone, and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const writer = await User.findOne({
            accountType: 'author',
            email: email.trim().toLowerCase(),
            mobile: phone.trim()
        });

        if (!writer) {
            return res.json({ success: false, message: "No writer found with this email and phone" });
        }

        writer.password = hashPassword(newPassword);
        await writer.save();

        res.json({ success: true, message: "Writer password reset successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getWriterBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ writer: req.writer.writerId }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getWriterComments = async (req, res) => {
    try {
        const blogs = await Blog.find({ writer: req.writer.writerId }).select('_id');
        const comments = await Comment.find({ blog: { $in: blogs.map((blog) => blog._id) } })
            .populate('blog')
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getWriterDashboard = async (req, res) => {
    try {
        const writerId = req.writer.writerId;
        const writerBlogs = await Blog.find({ writer: writerId }).sort({ createdAt: -1 });
        const recentBlogs = await Blog.find({ writer: writerId }).sort({ createdAt: -1 }).limit(5);
        const writerBlogIds = writerBlogs.map((blog) => blog._id);
        const blogs = writerBlogs.length;
        const comments = await Comment.countDocuments({ blog: { $in: writerBlogIds } });
        const drafts = await Blog.countDocuments({ writer: writerId, isPublished: false });

        res.json({
            success: true,
            dashboardData: {
                blogs,
                comments,
                drafts,
                recentBlogs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getPublicWriterProfile = async (req, res) => {
    try {
        const { username, writerId } = req.params;

        const writer = username
            ? await User.findOne({ username: username.trim().toLowerCase(), accountType: 'author' }).select('-password')
            : await User.findOne({ _id: writerId, accountType: 'author' }).select('-password');

        if (!writer) {
            return res.status(404).json({ success: false, message: 'Writer not found' });
        }

        const writerBlogs = await Blog.find({ writer: writer._id, isPublished: true }).sort({ createdAt: -1 }).lean();
        const writerBlogIds = writerBlogs.map((blog) => blog._id);

        const [commentsCount, followersCount, commentGroups] = await Promise.all([
            Comment.countDocuments({ blog: { $in: writerBlogIds }, isApproved: true }),
            User.countDocuments({ followingWriters: writer._id }),
            Comment.aggregate([
                { $match: { blog: { $in: writerBlogIds }, isApproved: true } },
                { $group: { _id: '$blog', count: { $sum: 1 } } }
            ])
        ]);

        const commentCountMap = commentGroups.reduce((acc, item) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        const readsCount = writerBlogs.reduce((total, blog) => total + (blog.viewsCount || 0), 0);
        const likesCount = writerBlogs.reduce((total, blog) => total + (blog.likesCount || 0), 0);

        res.json({
            success: true,
            profile: {
                writer: sanitizeWriter(writer),
                stats: {
                    followers: followersCount,
                    blogs: writerBlogs.length,
                    reads: readsCount,
                    likes: likesCount,
                    comments: commentsCount
                },
                blogs: writerBlogs.map((blog) => ({
                    ...blog,
                    commentsCount: commentCountMap[blog._id.toString()] || 0
                }))
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getPublicWriterDirectory = async (req, res) => {
    try {
        const search = req.query.q?.trim();
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search.toLowerCase(), $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const writers = await User.find({ accountType: 'author', ...query }).select('-password').sort({ createdAt: -1 }).lean();

        const writerIds = writers.map((writer) => writer._id);
        const blogs = await Blog.find({ writer: { $in: writerIds }, isPublished: true }).lean();

        const blogStats = blogs.reduce((acc, blog) => {
            const writerId = blog.writer?.toString();

            if (!acc[writerId]) {
                acc[writerId] = { blogs: 0, reads: 0 };
            }

            acc[writerId].blogs += 1;
            acc[writerId].reads += blog.viewsCount || 0;
            return acc;
        }, {});

        const followerCounts = await User.aggregate([
            { $match: { followingWriters: { $exists: true, $ne: [] } } },
            { $unwind: '$followingWriters' },
            { $group: { _id: '$followingWriters', count: { $sum: 1 } } }
        ]);

        const followerMap = followerCounts.reduce((acc, item) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        res.json({
            success: true,
            writers: writers.map((writer) => ({
                ...sanitizeWriter(writer),
                stats: {
                    followers: followerMap[writer._id.toString()] || 0,
                    blogs: blogStats[writer._id.toString()]?.blogs || 0,
                    reads: blogStats[writer._id.toString()]?.reads || 0
                }
            }))
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteWriterCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        const comment = await Comment.findById(id).populate('blog');

        if (!comment || !comment.blog || comment.blog.writer?.toString() !== req.writer.writerId) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const approveWriterCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        const comment = await Comment.findById(id).populate('blog');

        if (!comment || !comment.blog || comment.blog.writer?.toString() !== req.writer.writerId) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment approved successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
