import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    writer: {type: mongoose.Schema.Types.ObjectId, ref: 'writer'},
    writerName: {type: String},
    writerUsername: {type: String},
    title: {type: String, required: true},
    subTitle: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    isPublished: {type: Boolean, required: true, default: false},
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    sharesCount: {type: Number, default: 0},
    bookmarksCount: {type: Number, default: 0},
    viewsCount: {type: Number, default: 0},
},{timestamps: true});

const Blog = mongoose.model('blog', blogSchema);

export default Blog;
