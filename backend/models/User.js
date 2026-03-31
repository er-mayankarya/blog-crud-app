import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    dislikedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    followingWriters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'writer' }]
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export default User;
