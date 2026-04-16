import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: ['normal', 'author'], default: 'normal' },
    description: { type: String, trim: true, default: '' },
    authorSince: { type: Date },
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    dislikedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
    followingWriters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export default User;
