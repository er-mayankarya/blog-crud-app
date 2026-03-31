import fs from 'fs';
import imageKit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import main from '../configs/gemini.js';

const engagementFieldMap = {
    like: 'likesCount',
    dislike: 'dislikesCount',
    share: 'sharesCount',
    bookmark: 'bookmarksCount'
};

const attachCommentCounts = async (blogs) => {
    if (!blogs.length) return [];

    const blogIds = blogs.map((blog) => blog._id);
    const commentCounts = await Comment.aggregate([
        { $match: { blog: { $in: blogIds }, isApproved: true } },
        { $group: { _id: '$blog', count: { $sum: 1 } } }
    ]);

    const commentCountMap = commentCounts.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
    }, {});

    return blogs.map((blog) => ({
        ...blog,
        commentsCount: commentCountMap[blog._id.toString()] || 0
    }));
};

const buildBlogResponse = async (blog) => {
    const commentsCount = await Comment.countDocuments({ blog: blog._id, isApproved: true });

    return {
        ...blog.toObject(),
        commentsCount
    };
};

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog)
        const imageFile = req.file;

        if (!title || !subTitle || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)


        // Upload image to ImageKit
        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        // Optimize through ImageKit
        const optimizedImageUrl = imageKit.url({
            path: response.filePath,
            transformation: [{
                width: 1280,
                quality: "auto",
                format: "webp"
            }]
        });

        const image = optimizedImageUrl;

        await Blog.create({
            writer: req.writer?.writerId,
            writerName: req.writer?.name,
            writerUsername: req.writer?.username,
            title,
            subTitle,
            description,
            category,
            image,
            isPublished
        });

        res.json({ success: true, message: "Blog added successfully" });


    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).populate('writer', 'username description').sort({ createdAt: -1 }).lean();
        const blogsWithCounts = await attachCommentCounts(blogs);
        res.json({ success: true, blogs: blogsWithCounts });
    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId).populate('writer', 'name username description');
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        blog.viewsCount = (blog.viewsCount || 0) + 1;
        await blog.save();
        const blogWithCounts = await buildBlogResponse(blog);
        res.json({ success: true, blog: blogWithCounts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedBlog = await Blog.findOneAndDelete({ _id: id, writer: req.writer.writerId });
        if (!deletedBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        // Delete all comments too
        await Comment.deleteMany({ blog: id });


        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const togglePublished = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findOne({ _id: id, writer: req.writer.writerId });
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const addComment = async (req, res) => {
    try {
        const { blog, content } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await Comment.create({ blog, user: user._id, name: user.name, content });
        const commentsCount = await Comment.countDocuments({ blog, isApproved: true });
        res.json({ success: true, message: "Comment added for review", commentsCount });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const generateContent = async (req, res) => {
    try {
        const { currentContent, title, category } = req.body;

        if (!currentContent || !title) {
            return res.json({ success: false, message: 'Content and title are required' });
        }

        const prompt = `Based on this blog content: "${currentContent}", title: "${title}", and category: "${category}":
        Write a comprehensive blog post. 
        CRITICAL: Your entire response must be formatted in pure HTML. Use tags like <h1>, <h2>, <p>, <b>, <i>, <ul>, <ol>, <li>, and <a href="...">. 
        Do NOT use Markdown (no **, no ##). 
        Do NOT wrap your response in \`\`\`html ... \`\`\` blocks. Just return the raw HTML string.`;

        const generatedContent = await main(prompt);

        res.json({
            success: true,
            generatedContent: generatedContent.trim()
        });

    } catch (error) {
        console.error('Generate Content Error:', error);
        res.json({ success: false, message: 'Failed to generate content: ' + error.message });
    }
};

export const toggleBlogEngagement = async (req, res) => {
    try {
        const { blogId, action } = req.body;
        const field = engagementFieldMap[action];

        if (!blogId || !field || action === 'share') {
            return res.json({ success: false, message: 'Invalid engagement request' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }

        const blogIdString = blog._id.toString();

        if (action === 'bookmark') {
            const isSaved = user.savedBlogs.some((savedBlogId) => savedBlogId.toString() === blogIdString);
            user.savedBlogs = isSaved
                ? user.savedBlogs.filter((savedBlogId) => savedBlogId.toString() !== blogIdString)
                : [...user.savedBlogs, blog._id];
            blog.bookmarksCount = Math.max(0, (blog.bookmarksCount || 0) + (isSaved ? -1 : 1));
        }

        if (action === 'like') {
            const hasLiked = user.likedBlogs.some((likedBlogId) => likedBlogId.toString() === blogIdString);
            const hasDisliked = user.dislikedBlogs.some((dislikedBlogId) => dislikedBlogId.toString() === blogIdString);

            if (hasLiked) {
                user.likedBlogs = user.likedBlogs.filter((likedBlogId) => likedBlogId.toString() !== blogIdString);
                blog.likesCount = Math.max(0, (blog.likesCount || 0) - 1);
            } else {
                user.likedBlogs = [...user.likedBlogs, blog._id];
                blog.likesCount = (blog.likesCount || 0) + 1;

                if (hasDisliked) {
                    user.dislikedBlogs = user.dislikedBlogs.filter((dislikedBlogId) => dislikedBlogId.toString() !== blogIdString);
                    blog.dislikesCount = Math.max(0, (blog.dislikesCount || 0) - 1);
                }
            }
        }

        if (action === 'dislike') {
            const hasDisliked = user.dislikedBlogs.some((dislikedBlogId) => dislikedBlogId.toString() === blogIdString);
            const hasLiked = user.likedBlogs.some((likedBlogId) => likedBlogId.toString() === blogIdString);

            if (hasDisliked) {
                user.dislikedBlogs = user.dislikedBlogs.filter((dislikedBlogId) => dislikedBlogId.toString() !== blogIdString);
                blog.dislikesCount = Math.max(0, (blog.dislikesCount || 0) - 1);
            } else {
                user.dislikedBlogs = [...user.dislikedBlogs, blog._id];
                blog.dislikesCount = (blog.dislikesCount || 0) + 1;

                if (hasLiked) {
                    user.likedBlogs = user.likedBlogs.filter((likedBlogId) => likedBlogId.toString() !== blogIdString);
                    blog.likesCount = Math.max(0, (blog.likesCount || 0) - 1);
                }
            }
        }

        await user.save();
        await blog.save();

        const blogWithCounts = await buildBlogResponse(blog);

        res.json({
            success: true,
            message: 'Engagement updated successfully',
            blog: blogWithCounts,
            user: {
                savedBlogs: user.savedBlogs,
                likedBlogs: user.likedBlogs,
                dislikedBlogs: user.dislikedBlogs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const incrementBlogShare = async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }

        blog.sharesCount = (blog.sharesCount || 0) + 1;
        await blog.save();

        const blogWithCounts = await buildBlogResponse(blog);

        res.json({
            success: true,
            message: 'Share count updated successfully',
            blog: blogWithCounts
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
