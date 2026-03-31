import mongoose from "mongoose";

const writerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    password: { type: String, required: true }
}, { timestamps: true });

const Writer = mongoose.model('writer', writerSchema);

export default Writer;
